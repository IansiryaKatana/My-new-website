/**
 * Seeds CMS using an authenticated admin session (RLS allows admin writes).
 * Uses SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD from .env, or creates account.
 */
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadEnv() {
  const raw = readFileSync(resolve(root, '.env'), 'utf8').replace(/^\uFEFF/, '')
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/\r$/, '')
  }
}

loadEnv()

const url = process.env.VITE_SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY
const email = process.env.SEED_ADMIN_EMAIL ?? 'luxuryr.cms.seed@gmail.com'
const password = process.env.SEED_ADMIN_PASSWORD ?? 'LuxuryR_CMS_Seed_2026!'

const sb = createClient(url, anonKey, { auth: { persistSession: false } })

const json = (v) => JSON.stringify(v)

async function ensureSession() {
  let { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (!error) return data.session

  const signUp = await sb.auth.signUp({ email, password })
  if (signUp.error) throw new Error(`Auth failed: ${signUp.error.message}`)
  if (signUp.data.session) return signUp.data.session

  ;({ data, error } = await sb.auth.signInWithPassword({ email, password }))
  if (error) throw new Error(`Sign-in after signup: ${error.message}`)
  return data.session
}

async function upsert(table, rows, onConflict = 'id') {
  const { error } = await sb.from(table).upsert(rows, { onConflict })
  if (error) throw new Error(`${table}: ${error.message}`)
  console.log(`✓ ${table}`)
}

async function runSqlFile() {
  const sql = readFileSync(resolve(root, 'supabase/migrations/20260527100000_get_public_cms_snapshot.sql'), 'utf8')
  const { error } = await sb.rpc('exec_sql', { query: sql })
  if (error) console.warn('RPC migration (run seed_full.sql in SQL Editor if missing):', error.message)
}

async function main() {
  await ensureSession()
  console.log('Authenticated as admin')

  await upsert('site_settings', [
    { key: 'brand_name', value: json('Marcellaro') },
    { key: 'hero_headline', value: json('LUXURY REAL ESTATE') },
    { key: 'hero_subheadline', value: json('with full service support') },
    { key: 'hero_trust_copy', value: json("We'll find and verify truly the best option for you") },
    { key: 'contact_phone', value: json('+1 (310) 555-0487') },
    { key: 'contact_availability', value: json('available 7 days a week') },
    { key: 'hero_image', value: json('/images/hero-L.png') },
    { key: 'faq_image', value: json('https://images.unsplash.com/photo-1618221195710-e3f330b0e0f0?w=800&q=80') },
    { key: 'cta_image', value: json('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80') },
  ], 'key')

  await upsert('property_categories', [
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', slug: 'loft', label: 'Loft', sort_order: 1, active: true },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', slug: 'budget', label: 'Budget', sort_order: 2, active: true },
    { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', slug: 'rent', label: 'Rent', sort_order: 3, active: true },
  ], 'slug')

  await upsert('properties', [
    { id: '11111111-1111-1111-1111-111111111101', slug: 'family-villa', title: 'Family Villa', location: 'Malibu, California', description: 'A spacious villa with a pool, living area, outdoor patio, and terrace overlooking the Pacific.', price_from: 2950000, image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80', category: 'loft', status: 'New Listing', bedrooms: 5, bathrooms: 4, area_label: '320 m²', year_label: '25 yr', published: true, sort_order: 1 },
    { id: '11111111-1111-1111-1111-111111111102', slug: 'serene-edge', title: 'Serene Edge', location: 'Malibu, California', description: 'An architectural retreat with infinity pool, glass walls, and uninterrupted ocean views.', price_from: 2470000, image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80', category: 'budget', status: 'New Listing', bedrooms: 4, bathrooms: 3, area_label: '280 m²', year_label: '12 yr', published: true, sort_order: 2 },
    { id: '11111111-1111-1111-1111-111111111103', slug: 'modern-hillside', title: 'Modern Hillside', location: 'Malibu, California', description: 'Multi-level hillside residence with panoramic views, private gardens, and refined interiors.', price_from: 1650000, image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80', category: 'rent', status: 'New Listing', bedrooms: 3, bathrooms: 2, area_label: '210 m²', year_label: '8 yr', published: true, sort_order: 3 },
  ], 'slug')

  await sb.from('hero_stats').delete().in('label', ['successful deals', 'years experience', 'verified houses'])
  await upsert('hero_stats', [
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb101', label: 'successful deals', value: '100+', sort_order: 1, published: true },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb102', label: 'years experience', value: '15', sort_order: 2, published: true },
    { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbb103', label: 'verified houses', value: '87', sort_order: 3, published: true },
  ])

  await upsert('faq_topics', [{ id: '22222222-2222-2222-2222-222222222201', title: 'General', sort_order: 0, published: true }])
  await upsert('faq_entries', [
    { id: 'ffffffff-ffff-ffff-ffff-ffffffffff01', topic_id: '22222222-2222-2222-2222-222222222201', question: 'How can I be sure the property is legally verified?', answer: 'Every listing undergoes title search, lien review, and compliance checks before it appears on our site.', sort_order: 1, published: true },
    { id: 'ffffffff-ffff-ffff-ffff-ffffffffff02', topic_id: '22222222-2222-2222-2222-222222222201', question: 'Why work with agents that have passed a full legal check?', answer: 'Our advisors are vetted for licensing, transaction history, and regulatory compliance.', sort_order: 2, published: true },
    { id: 'ffffffff-ffff-ffff-ffff-ffffffffff03', topic_id: '22222222-2222-2222-2222-222222222201', question: "Can I buy property if I'm not from this country?", answer: 'Yes. We support international buyers with documentation guidance and local legal partners.', sort_order: 3, published: true },
    { id: 'ffffffff-ffff-ffff-ffff-ffffffffff04', topic_id: '22222222-2222-2222-2222-222222222201', question: 'Do I need to be present in person for the paperwork?', answer: 'Many steps can be handled remotely via power of attorney and digital signing where permitted.', sort_order: 4, published: true },
    { id: 'ffffffff-ffff-ffff-ffff-ffffffffff05', topic_id: '22222222-2222-2222-2222-222222222201', question: 'How long does the whole process take?', answer: 'Typical transactions range from 30–90 days depending on financing, inspections, and jurisdiction.', sort_order: 5, published: true },
    { id: 'ffffffff-ffff-ffff-ffff-ffffffffff06', topic_id: '22222222-2222-2222-2222-222222222201', question: "I'm afraid of losing my money — how is this protected?", answer: 'Funds are held in regulated escrow accounts with milestone-based releases tied to verified milestones.', sort_order: 6, published: true },
    { id: 'ffffffff-ffff-ffff-ffff-ffffffffff07', topic_id: '22222222-2222-2222-2222-222222222201', question: 'Can I sell the property I buy?', answer: "Yes. We also provide resale advisory and market positioning for owners when you're ready to exit.", sort_order: 7, published: true },
    { id: 'ffffffff-ffff-ffff-ffff-ffffffffff08', topic_id: '22222222-2222-2222-2222-222222222201', question: "I don't understand legal details — who will explain everything?", answer: 'Your dedicated advisor and our legal team walk you through each document in plain language.', sort_order: 8, published: true },
  ])

  await upsert('team_members', [
    { id: 'dddddddd-dddd-dddd-dddd-dddddddddd01', name: 'Natalie Brooks', role: 'Senior Property Advisor', bio: 'Specializes in coastal estates and off-market acquisitions.', image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80', bullets: ['15+ years', 'Malibu specialist', 'Legal verification'], published: true, sort_order: 1 },
    { id: 'dddddddd-dddd-dddd-dddd-dddddddddd02', name: 'Daniel Merron', role: 'CEO & Lead Concierge', bio: 'Oversees end-to-end client journeys from selection to closing.', image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80', bullets: ['100+ deals', 'International buyers', 'Full paperwork support'], published: true, sort_order: 2 },
    { id: 'dddddddd-dddd-dddd-dddd-dddddddddd03', name: 'Markus Bell', role: 'Legal & Compliance Director', bio: 'Ensures every property passes rigorous legal and title verification.', image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80', bullets: ['Title review', 'Escrow oversight', 'Risk protection'], published: true, sort_order: 3 },
  ])

  await upsert('process_steps', [
    { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', step_number: '01', title: 'Property selection', description: 'We curate verified options aligned with your lifestyle, budget, and investment goals.', image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80', published: true, sort_order: 1 },
    { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', step_number: '02', title: 'Legal verification', description: 'Title, liens, and compliance are reviewed before any commitment.', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80', published: true, sort_order: 2 },
    { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', step_number: '03', title: 'Viewing & negotiation', description: 'Private tours and discreet negotiation on your behalf.', image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80', published: true, sort_order: 3 },
    { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee04', step_number: '04', title: 'Paperwork & escrow', description: 'We coordinate contracts, escrow, and milestone payments.', image_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80', published: true, sort_order: 4 },
    { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee05', step_number: '05', title: 'Closing & handover', description: 'Final walkthrough, keys, and post-sale support.', image_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80', published: true, sort_order: 5 },
    { id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeee06', step_number: '06', title: 'Aftercare', description: 'Ongoing advisory for maintenance, rental, or resale.', image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80', published: true, sort_order: 6 },
  ])

  await upsert('testimonials', [
    { id: 'cccccccc-cccc-cccc-cccc-cccccccccc01', client_name: 'Sarah Mitchell', client_location: 'Beverly Hills, CA', title: 'Found our dream villa', quote: 'Marcellaro guided us through every step. The property was verified, the paperwork seamless, and the experience felt truly private.', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80', property_image_url: null, assigned_agent: 'Daniel Merron', card_type: 'text', published: true, sort_order: 1 },
    { id: 'cccccccc-cccc-cccc-cccc-cccccccccc02', client_name: 'Property Preview', client_location: 'Malibu', title: 'Serene Edge', quote: '', avatar_url: null, property_image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', assigned_agent: null, card_type: 'image', published: true, sort_order: 2 },
    { id: 'cccccccc-cccc-cccc-cccc-cccccccccc03', client_name: 'James Chen', client_location: 'Pacific Palisades, CA', title: 'International buyer confidence', quote: 'As a non-resident buyer, I needed legal certainty. The team explained every document and protected my investment.', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80', property_image_url: null, assigned_agent: 'Natalie Brooks', card_type: 'text', published: true, sort_order: 3 },
    { id: 'cccccccc-cccc-cccc-cccc-cccccccccc04', client_name: 'Elena Rodriguez', client_location: 'Santa Monica, CA', title: 'From request to keys', quote: 'The process was transparent from day one. We always knew the next step and never felt rushed.', avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80', property_image_url: null, assigned_agent: 'Markus Bell', card_type: 'text', published: true, sort_order: 4 },
  ])

  await upsert('marketing_blocks', [
    { id: '99999999-9999-9999-9999-999999999901', key: 'quote_pause', title: "We've seen all misleading labels.", body: 'Not perfect option and we will show some listings', cta_label: 'GET IN TOUCH', cta_href: '#contact', published: true },
    { id: '99999999-9999-9999-9999-999999999902', key: 'filter_helper', title: null, body: 'Select your way · Make a request · Watch your project', cta_label: null, cta_href: null, published: true },
  ], 'key')

  await runSqlFile()
  console.log('\n✅ CMS seeded. Run supabase/seed_full.sql in SQL Editor to install get_public_cms_snapshot RPC.')
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
