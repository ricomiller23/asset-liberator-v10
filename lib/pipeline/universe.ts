import type { TargetCompany } from "../types";
import { normalizeCik, seedToCandidate } from "./seed";
import { mergeSignals } from "./ingest";
import { scoreCandidate } from "./model";
import { candidateToTargetCompany } from "./adapter";
import type { Candidate, CandidateStoreFile, ScoredCandidate } from "./types";

/**
 * Deduplicates seeds and ingested TargetCompany records by CIK with leading zeros stripped.
 * The seed wins, but append the ingested signals to the seed's vehicleDistress.secTriggers.
 */
export function mergeSeedAndIngestedTargets(
  seeds: TargetCompany[],
  ingested: TargetCompany[]
): TargetCompany[] {
  const byKey = new Map<string, TargetCompany>();

  // 1. Seed records take priority
  for (const s of seeds) {
    const norm = normalizeCik(s.cik);
    const key = norm ? `cik-${norm}` : s.id;
    byKey.set(key, { ...s });
  }

  // 2. Ingested records added or attached
  for (const ing of ingested) {
    const norm = normalizeCik(ing.cik);
    let key = norm ? `cik-${norm}` : ing.id;

    let existingSeed = byKey.get(key);
    if (!existingSeed && ing.ticker) {
      for (const [k, v] of byKey.entries()) {
        if (v.ticker && v.ticker.toUpperCase() === ing.ticker.toUpperCase()) {
          existingSeed = v;
          key = k;
          break;
        }
      }
    }

    if (existingSeed) {
      // Seed wins for verified SEC thesis gates & financials, but MERGE triggers, signals, contacts, and CRM
      const mergedTriggers = Array.from(
        new Set([...existingSeed.vehicleDistress.secTriggers, ...(ing.vehicleDistress.secTriggers || [])])
      );
      const mergedSignals = Array.from(
        new Set([...(existingSeed.signals || []), ...(ing.signals || [])])
      );

      // Merge CRM activities (ingested activities first)
      const existingActivities = existingSeed.crm?.activities || [];
      const ingestedActivities = ing.crm?.activities || [];
      const seenActSummaries = new Set<string>();
      const mergedActivities = [...ingestedActivities, ...existingActivities].filter((act) => {
        const k = `${act.date}-${act.summary}`;
        if (seenActSummaries.has(k)) return false;
        seenActSummaries.add(k);
        return true;
      });

      // Merge CRM notes
      const existingNotes = existingSeed.crm?.notes || [];
      const ingestedNotes = ing.crm?.notes || [];
      const seenNoteTexts = new Set<string>();
      const mergedNotes = [...ingestedNotes, ...existingNotes].filter((n) => {
        const k = `${n.date}-${n.text}`;
        if (seenNoteTexts.has(k)) return false;
        seenNoteTexts.add(k);
        return true;
      });

      // Merge Stage
      const stage = (ing.crm?.stage && ing.crm.stage !== "new")
        ? ing.crm.stage
        : (existingSeed.crm?.stage || "new");

      // Merge lastContactDate
      const ingDate = ing.crm?.lastContactDate || "";
      const seedDate = existingSeed.crm?.lastContactDate || "";
      const lastContactDate = (ingDate && ingDate > seedDate) ? ingDate : (seedDate || ingDate);

      // Merge Contacts
      const ingContacts = ing.contacts || [];
      const seedContacts = existingSeed.contacts || [];
      const mergedContacts = [...ingContacts];
      for (const sc of seedContacts) {
        if (!mergedContacts.some(c => (c.email && sc.email && c.email.toLowerCase() === sc.email.toLowerCase()) || c.name.toLowerCase() === sc.name.toLowerCase())) {
          mergedContacts.push(sc);
        }
      }

      byKey.set(key, {
        ...existingSeed,
        contacts: mergedContacts.length > 0 ? mergedContacts : existingSeed.contacts,
        vehicleDistress: {
          ...existingSeed.vehicleDistress,
          secTriggers: mergedTriggers,
        },
        signals: mergedSignals,
        crm: {
          stage,
          priority: existingSeed.crm?.priority || ing.crm?.priority || "medium",
          notes: mergedNotes,
          activities: mergedActivities,
          lastContactDate,
          nextFollowUpDate: ing.crm?.nextFollowUpDate || existingSeed.crm?.nextFollowUpDate,
        },
      });
    } else {
      byKey.set(key, { ...ing });
    }
  }

  return [...byKey.values()];
}

/**
 * Build unified universe from candidate store
 */
export function buildUniverse(
  seeds: TargetCompany[],
  store: { candidates: Candidate[] },
  now: Date = new Date()
): ScoredCandidate[] {
  const byCik = new Map<string, Candidate>();

  for (const s of seeds) {
    const c = seedToCandidate(s);
    const key = c.cik || c.id;
    byCik.set(key, c);
  }

  for (const ing of store.candidates) {
    const key = ing.cik || ing.id;
    const seed = byCik.get(key);
    if (seed) {
      byCik.set(ing.cik, {
        ...seed,
        signals: mergeSignals(seed.signals, ing.signals, now),
        separable: {
          ...seed.separable,
          ex21Count: Math.max(seed.separable.ex21Count, ing.separable.ex21Count),
          entities: Array.from(new Set([...seed.separable.entities, ...ing.separable.entities])),
          consolidatedRevenue: ing.separable.consolidatedRevenue ?? seed.separable.consolidatedRevenue,
          consolidatedEquity: ing.separable.consolidatedEquity ?? seed.separable.consolidatedEquity,
        },
        dataQualityFlags: [...seed.dataQualityFlags, "edgar_signals_attached"],
      });
    } else {
      byCik.set(ing.cik, ing);
    }
  }

  return [...byCik.values()].map((c) => scoreCandidate(c, now));
}
