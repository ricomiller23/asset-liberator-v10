# research_replacement_contacts.py — Research direct replacement contacts for bounced targets
import json, os, re, sys

BANNED_PREFIXES = {'info', 'contact', 'restructuring', 'support', 'legal', 'sales',
                   'admin', 'ir', 'investor', 'investors', 'management', 'corp',
                   'team', 'help', 'billing', 'press', 'media', 'firm', 'office',
                   'general', 'inquiries', 'hello'}

SUPPRESSED_DOMAINS = {'mcguirewoods.com', 'gibsondunn.com', 'whitleylawgroup.com', 'whitley-llp.com', 'whitleyllp.com'}

def is_valid_direct_email(email):
    if not email or '@' not in email:
        return False, "Invalid format"
    clean = email.strip().lower()
    prefix, domain = clean.split('@', 1)
    if domain in SUPPRESSED_DOMAINS or 'mcguirewoods' in clean:
        return False, f"Suppressed domain: {domain}"
    if prefix in BANNED_PREFIXES:
        return False, f"Generic prefix banned: {prefix}@"
    # Must contain a dot in domain
    if '.' not in domain:
        return False, "Invalid domain"
    return True, "Valid direct email"

def audit_and_flag_bounces():
    bounces_file = '/Users/ericmiller/.gemini/antigravity-ide/scratch/asset-liberator/data/extracted_bounces.json'
    targets_file = '/Users/ericmiller/.gemini/antigravity-ide/scratch/asset-liberator/data/ingested-targets.json'
    
    if not os.path.exists(bounces_file) or not os.path.exists(targets_file):
        print("Data files not found.")
        return
        
    with open(bounces_file) as f:
        bounces = set(json.load(f))
        
    with open(targets_file) as f:
        target_data = json.load(f)
        
    targets = target_data.get('targets', [])
    bounced_contacts = []
    
    for t in targets:
        for c in t.get('contacts', []):
            em = (c.get('email') or '').strip().lower()
            if em in bounces:
                c['bounced'] = True
                bounced_contacts.append({
                    'ticker': t.get('ticker'),
                    'company': t.get('name'),
                    'name': c.get('name'),
                    'title': c.get('title'),
                    'bounced_email': em
                })
                
    print(f"Found {len(bounced_contacts)} bounced contact(s) across target companies.")
    return bounced_contacts

if __name__ == '__main__':
    audit_and_flag_bounces()
