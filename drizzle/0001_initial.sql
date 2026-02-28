-- D1 Migration: Initial Schema
CREATE TABLE IF NOT EXISTS countries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  flag_emoji TEXT,
  visa_system TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS visa_types (
  id TEXT PRIMARY KEY,
  country_id TEXT REFERENCES countries(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  processing_time_days INTEGER,
  fee_amount REAL,
  fee_currency TEXT DEFAULT 'GBP',
  gov_url TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS document_requirements (
  id TEXT PRIMARY KEY,
  visa_type_id TEXT REFERENCES visa_types(id),
  doc_key TEXT NOT NULL,
  doc_name TEXT NOT NULL,
  description TEXT,
  source_url TEXT,
  source_instructions TEXT,
  is_mandatory INTEGER DEFAULT 1,
  requires_translation INTEGER DEFAULT 0,
  requires_notarization INTEGER DEFAULT 0,
  accepted_formats TEXT,
  condition_field TEXT,
  condition_value TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  visa_type_id TEXT REFERENCES visa_types(id),
  title TEXT DEFAULT 'Yeni Başvuru',
  status TEXT DEFAULT 'chat',
  case_profile TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  case_id TEXT REFERENCES cases(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS case_documents (
  id TEXT PRIMARY KEY,
  case_id TEXT REFERENCES cases(id),
  doc_requirement_id TEXT REFERENCES document_requirements(id),
  doc_key TEXT NOT NULL,
  file_path TEXT,
  file_name TEXT,
  file_type TEXT,
  status TEXT DEFAULT 'pending',
  ai_extracted_data TEXT DEFAULT '{}',
  ai_validation_notes TEXT,
  uploaded_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS generated_letters (
  id TEXT PRIMARY KEY,
  case_id TEXT REFERENCES cases(id),
  letter_type TEXT NOT NULL,
  content TEXT NOT NULL,
  is_finalized INTEGER DEFAULT 0,
  generated_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_gbp REAL NOT NULL,
  price_try REAL,
  stripe_price_id TEXT,
  features TEXT DEFAULT '[]',
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  case_id TEXT REFERENCES cases(id),
  plan_id TEXT REFERENCES plans(id),
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cases_user_id ON cases(user_id);
CREATE INDEX IF NOT EXISTS idx_case_documents_case_id ON case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_case_id ON chat_messages(case_id);
CREATE INDEX IF NOT EXISTS idx_doc_requirements_visa_type ON document_requirements(visa_type_id);
