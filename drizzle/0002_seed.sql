-- D1 Seed Data
INSERT OR IGNORE INTO countries (id, name, code, flag_emoji, visa_system) VALUES
  ('c-gbr', 'United Kingdom', 'GBR', '🇬🇧', 'UK'),
  ('c-fra', 'France', 'FRA', '🇫🇷', 'Schengen'),
  ('c-deu', 'Germany', 'DEU', '🇩🇪', 'Schengen'),
  ('c-nld', 'Netherlands', 'NLD', '🇳🇱', 'Schengen'),
  ('c-esp', 'Spain', 'ESP', '🇪🇸', 'Schengen'),
  ('c-ita', 'Italy', 'ITA', '🇮🇹', 'Schengen');

INSERT OR IGNORE INTO visa_types (id, country_id, name, slug, description, processing_time_days, fee_amount, gov_url) VALUES
  ('vt-uk-sv', 'c-gbr', 'Standard Visitor Visa', 'uk-standard-visitor', 'For tourism, family visits, or short business trips to the UK (up to 6 months)', 21, 115.00, 'https://www.gov.uk/standard-visitor'),
  ('vt-uk-st', 'c-gbr', 'UK Student Visa', 'uk-student-visa', 'For studying in the UK for more than 6 months', 15, 490.00, 'https://www.gov.uk/student-visa'),
  ('vt-fr-sc', 'c-fra', 'Schengen Tourist Visa (France)', 'schengen-tourist-fra', 'Short stay visa for tourism or family visit in France / Schengen area', 15, 80.00, 'https://france-visas.gouv.fr');

INSERT OR IGNORE INTO plans (id, name, price_gbp, price_try, features) VALUES
  ('plan-diy', 'DIY', 49.00, 1600.00, '["AI visa type detection","Personalised document checklist","Letter templates","Consistency checker","Application form guide"]'),
  ('plan-assisted', 'Assisted', 149.00, 5000.00, '["Everything in DIY","Human advisor review","Letter corrections","Priority support"]'),
  ('plan-managed', 'Managed', 299.00, 10000.00, '["Everything in Assisted","VFS appointment guidance","Free revision if refused","Dedicated case manager"]');

-- Demo user for testing
INSERT OR IGNORE INTO users (id, email, name) VALUES
  ('demo-user', 'demo@visaflow.ai', 'Demo Kullanıcı');
