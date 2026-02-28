import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const countries = sqliteTable('countries', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  flag_emoji: text('flag_emoji'),
  visa_system: text('visa_system').notNull(),
  is_active: integer('is_active', { mode: 'boolean' }).default(true),
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
})

export const visa_types = sqliteTable('visa_types', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  country_id: text('country_id').references(() => countries.id),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  processing_time_days: integer('processing_time_days'),
  fee_amount: real('fee_amount'),
  fee_currency: text('fee_currency').default('GBP'),
  gov_url: text('gov_url'),
  is_active: integer('is_active', { mode: 'boolean' }).default(true),
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
})

export const document_requirements = sqliteTable('document_requirements', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  visa_type_id: text('visa_type_id').references(() => visa_types.id),
  doc_key: text('doc_key').notNull(),
  doc_name: text('doc_name').notNull(),
  description: text('description'),
  source_url: text('source_url'),
  source_instructions: text('source_instructions'),
  is_mandatory: integer('is_mandatory', { mode: 'boolean' }).default(true),
  requires_translation: integer('requires_translation', { mode: 'boolean' }).default(false),
  requires_notarization: integer('requires_notarization', { mode: 'boolean' }).default(false),
  accepted_formats: text('accepted_formats'),
  condition_field: text('condition_field'),
  condition_value: text('condition_value'),
  display_order: integer('display_order').default(0),
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
})

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  name: text('name'),
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
})

export const cases = sqliteTable('cases', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: text('user_id').references(() => users.id),
  visa_type_id: text('visa_type_id').references(() => visa_types.id),
  title: text('title').default('Yeni Başvuru'),
  status: text('status').default('chat'),
  case_profile: text('case_profile', { mode: 'json' }).$defaultFn(() => ({})),
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
  updated_at: text('updated_at').$defaultFn(() => new Date().toISOString()),
})

export const chat_messages = sqliteTable('chat_messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  case_id: text('case_id').references(() => cases.id),
  role: text('role').notNull(),
  content: text('content').notNull(),
  metadata: text('metadata', { mode: 'json' }).$defaultFn(() => ({})),
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
})

export const case_documents = sqliteTable('case_documents', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  case_id: text('case_id').references(() => cases.id),
  doc_requirement_id: text('doc_requirement_id').references(() => document_requirements.id),
  doc_key: text('doc_key').notNull(),
  file_path: text('file_path'),
  file_name: text('file_name'),
  file_type: text('file_type'),
  status: text('status').default('pending'),
  ai_extracted_data: text('ai_extracted_data', { mode: 'json' }).$defaultFn(() => ({})),
  ai_validation_notes: text('ai_validation_notes'),
  uploaded_at: text('uploaded_at'),
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
})

export const generated_letters = sqliteTable('generated_letters', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  case_id: text('case_id').references(() => cases.id),
  letter_type: text('letter_type').notNull(),
  content: text('content').notNull(),
  is_finalized: integer('is_finalized', { mode: 'boolean' }).default(false),
  generated_at: text('generated_at').$defaultFn(() => new Date().toISOString()),
  updated_at: text('updated_at').$defaultFn(() => new Date().toISOString()),
})

export const plans = sqliteTable('plans', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  price_gbp: real('price_gbp').notNull(),
  price_try: real('price_try'),
  stripe_price_id: text('stripe_price_id'),
  features: text('features', { mode: 'json' }).$defaultFn(() => []),
  is_active: integer('is_active', { mode: 'boolean' }).default(true),
})

export const purchases = sqliteTable('purchases', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: text('user_id').references(() => users.id),
  case_id: text('case_id').references(() => cases.id),
  plan_id: text('plan_id').references(() => plans.id),
  stripe_session_id: text('stripe_session_id'),
  stripe_payment_intent: text('stripe_payment_intent'),
  status: text('status').default('pending'),
  created_at: text('created_at').$defaultFn(() => new Date().toISOString()),
})
