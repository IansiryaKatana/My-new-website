/**
 * Seeds the live Supabase database with demo users and dummy records on every table.
 * Run: bun scripts/seed-database.ts
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/integrations/supabase/types";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const SEED_PASSWORD = "RentflowDemo123!";
const SEED_DOMAIN = "@rentflow.demo";

const IDS = {
  owner: "a1000001-0000-4000-8000-000000000001",
  agent: "a1000001-0000-4000-8000-000000000002",
  tenant1: "a1000001-0000-4000-8000-000000000011",
  tenant2: "a1000001-0000-4000-8000-000000000012",
  tenant3: "a1000001-0000-4000-8000-000000000013",
  property1: "b2000001-0000-4000-8000-000000000001",
  property2: "b2000001-0000-4000-8000-000000000002",
  property3: "b2000001-0000-4000-8000-000000000003",
  property4: "b2000001-0000-4000-8000-000000000004",
  property5: "b2000001-0000-4000-8000-000000000005",
  viewing1: "c3000001-0000-4000-8000-000000000001",
  viewing2: "c3000001-0000-4000-8000-000000000002",
  viewing3: "c3000001-0000-4000-8000-000000000003",
  application1: "d4000001-0000-4000-8000-000000000001",
  application2: "d4000001-0000-4000-8000-000000000002",
  application3: "d4000001-0000-4000-8000-000000000003",
  appDoc1: "e5000001-0000-4000-8000-000000000001",
  appDoc2: "e5000001-0000-4000-8000-000000000002",
  appDoc3: "e5000001-0000-4000-8000-000000000003",
  tenancy1: "f6000001-0000-4000-8000-000000000001",
  tenancy2: "f6000001-0000-4000-8000-000000000002",
  tenancy3: "f6000001-0000-4000-8000-000000000003",
  payment1: "70000001-0000-4000-8000-000000000001",
  payment2: "70000001-0000-4000-8000-000000000002",
  payment3: "70000001-0000-4000-8000-000000000003",
  payment4: "70000001-0000-4000-8000-000000000004",
  payment5: "70000001-0000-4000-8000-000000000005",
  ticket1: "80000001-0000-4000-8000-000000000001",
  ticket2: "80000001-0000-4000-8000-000000000002",
  ticketUpdate1: "81000001-0000-4000-8000-000000000001",
  ticketUpdate2: "81000001-0000-4000-8000-000000000002",
  complaint1: "90000001-0000-4000-8000-000000000001",
  renewal1: "a0000001-0000-4000-8000-000000000001",
  renewal2: "a0000001-0000-4000-8000-000000000002",
  message1: "b1000001-0000-4000-8000-000000000001",
  message2: "b1000001-0000-4000-8000-000000000002",
  message3: "b1000001-0000-4000-8000-000000000003",
  activity1: "c1000001-0000-4000-8000-000000000001",
  activity2: "c1000001-0000-4000-8000-000000000002",
  activity3: "c1000001-0000-4000-8000-000000000003",
  image1: "d1000001-0000-4000-8000-000000000001",
  image2: "d1000001-0000-4000-8000-000000000002",
  image3: "d1000001-0000-4000-8000-000000000003",
  image4: "d1000001-0000-4000-8000-000000000004",
  image5: "d1000001-0000-4000-8000-000000000005",
} as const;

const USERS = [
  { id: IDS.owner, email: `owner${SEED_DOMAIN}`, full_name: "Ahmed Al Mansoori", phone: "+971501234567", role: "owner" as const },
  { id: IDS.agent, email: `agent${SEED_DOMAIN}`, full_name: "Fatima Al Zaabi", phone: "+971502345678", role: "agent" as const },
  { id: IDS.tenant1, email: `james.wilson${SEED_DOMAIN}`, full_name: "James Wilson", phone: "+971503456789", role: "tenant" as const, emirates_id: "784-1988-1234567-1", nationality: "British" },
  { id: IDS.tenant2, email: `sara.khan${SEED_DOMAIN}`, full_name: "Sara Khan", phone: "+971504567890", role: "tenant" as const, emirates_id: "784-1992-7654321-2", nationality: "Pakistani" },
  { id: IDS.tenant3, email: `omar.hassan${SEED_DOMAIN}`, full_name: "Omar Hassan", phone: "+971505678901", role: "tenant" as const, emirates_id: "784-1990-9876543-3", nationality: "Egyptian" },
];

async function clearSeedData() {
  console.log("Clearing existing seed data...");

  const tables = [
    "activity_log",
    "messages",
    "maintenance_updates",
    "maintenance_tickets",
    "complaints",
    "renewals",
    "payments",
    "application_documents",
    "tenancies",
    "applications",
    "viewings",
    "property_images",
    "properties",
    "user_roles",
  ] as const;

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error && !error.message.includes("No rows")) {
      console.warn(`  warn clearing ${table}:`, error.message);
    }
  }

  await supabase.from("agency_settings").update({
    agency_name: "Rentflow",
    legal_name: "Rentflow Property Management LLC",
    contact_email: "hello@rentflow.ae",
    contact_phone: "+97144332211",
    whatsapp_number: "+971501112233",
    address: "Office 1204, Marina Plaza, Dubai Marina, UAE",
    vat_number: "100123456700003",
    trade_license: "1234567",
    rera_number: "12345",
    ejari_contact: "ejari@rentflow.ae",
    brand_color: "#ED254E",
    color_prussian: "#011936",
    color_charcoal: "#465362",
    color_mint_cream: "#F4FFFD",
    color_royal_gold: "#F9DC5C",
    color_watermelon: "#ED254E",
    currency: "AED",
    default_agency_fee_pct: 5,
    default_security_deposit_pct: 5,
    stripe_charges_enabled: false,
    stripe_payouts_enabled: false,
    stripe_country: "AE",
  }).eq("id", 1);

  for (const user of USERS) {
    const { data: listed } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existing = listed?.users?.find((u) => u.email === user.email || u.id === user.id);
    if (existing) {
      const { error } = await supabase.auth.admin.deleteUser(existing.id);
      if (error) console.warn(`  warn deleting user ${user.email}:`, error.message);
    }
  }

  const { data: allUsers } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  for (const u of allUsers?.users ?? []) {
    if (u.email?.endsWith(SEED_DOMAIN)) {
      await supabase.auth.admin.deleteUser(u.id);
    }
  }
}

async function createUsers() {
  console.log("Creating demo users...");

  for (const user of USERS) {
    const { error } = await supabase.auth.admin.createUser({
      id: user.id,
      email: user.email,
      password: SEED_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: user.full_name, phone: user.phone },
    });
    if (error) throw new Error(`Failed to create ${user.email}: ${error.message}`);
  }

  for (const user of USERS) {
    await supabase.from("profiles").update({
      full_name: user.full_name,
      phone: user.phone,
      emirates_id: "emirates_id" in user ? user.emirates_id : null,
      nationality: "nationality" in user ? user.nationality : null,
    }).eq("id", user.id);
  }

  await supabase.from("user_roles").delete().in("user_id", USERS.map((u) => u.id));

  const { error: rolesError } = await supabase.from("user_roles").insert(
    USERS.map((u) => ({ user_id: u.id, role: u.role })),
  );
  if (rolesError) throw new Error(`Failed to set roles: ${rolesError.message}`);
}

async function seedProperties() {
  console.log("Seeding properties and images...");

  const properties = [
    {
      id: IDS.property1,
      reference: "RF-MH-201",
      title: "Marina Heights — 2BR Sea View",
      description: "Bright two-bedroom apartment with full marina views, maid's room, and covered parking.",
      community: "Dubai Marina",
      sub_community: "Marina Promenade",
      building: "Marina Heights Tower",
      unit_no: "201",
      property_type: "apartment" as const,
      beds: 2,
      baths: 2,
      sqft: 1250,
      rent_yearly: 120000,
      cheques_accepted: 4,
      security_deposit: 6000,
      agency_fee: 6000,
      available_from: "2026-07-01",
      furnished: true,
      amenities: ["pool", "gym", "concierge", "parking"],
      cover_image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      status: "available" as const,
      listed_by: IDS.agent,
      view_count: 142,
    },
    {
      id: IDS.property2,
      reference: "RF-DB-508",
      title: "Downtown Boulevard Studio",
      description: "Compact furnished studio walking distance to Dubai Mall and Burj Khalifa.",
      community: "Downtown Dubai",
      sub_community: "Boulevard Point",
      building: "Boulevard Central",
      unit_no: "508",
      property_type: "studio" as const,
      beds: 0,
      baths: 1,
      sqft: 520,
      rent_yearly: 72000,
      cheques_accepted: 2,
      security_deposit: 3600,
      agency_fee: 3600,
      available_from: "2026-06-15",
      furnished: true,
      amenities: ["gym", "pool"],
      cover_image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      status: "available" as const,
      listed_by: IDS.agent,
      view_count: 89,
    },
    {
      id: IDS.property3,
      reference: "RF-PJ-V12",
      title: "Palm Jumeirah Garden Villa",
      description: "Four-bedroom villa with private garden, pool, and beach club access.",
      community: "Palm Jumeirah",
      sub_community: "Frond M",
      building: "Villa 12",
      unit_no: "12",
      property_type: "villa" as const,
      beds: 4,
      baths: 5,
      sqft: 5200,
      rent_yearly: 450000,
      cheques_accepted: 4,
      security_deposit: 22500,
      agency_fee: 22500,
      available_from: "2025-01-01",
      furnished: false,
      amenities: ["pool", "garden", "beach_access", "maid_room"],
      cover_image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      status: "rented" as const,
      listed_by: IDS.owner,
      view_count: 310,
    },
    {
      id: IDS.property4,
      reference: "RF-JBR-1402",
      title: "JBR Beach Residence 1BR",
      description: "One-bedroom beachfront unit with balcony overlooking The Walk.",
      community: "JBR",
      sub_community: "Sadaf",
      building: "Rimal 4",
      unit_no: "1402",
      property_type: "apartment" as const,
      beds: 1,
      baths: 2,
      sqft: 890,
      rent_yearly: 95000,
      cheques_accepted: 4,
      security_deposit: 4750,
      agency_fee: 4750,
      available_from: "2026-08-01",
      furnished: true,
      amenities: ["beach_access", "pool", "gym"],
      cover_image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      status: "reserved" as const,
      listed_by: IDS.agent,
      view_count: 67,
    },
    {
      id: IDS.property5,
      reference: "RF-BB-O15",
      title: "Business Bay Office Suite",
      description: "Grade-A fitted office with canal views — ideal for boutique consultancy.",
      community: "Business Bay",
      sub_community: "Bay Square",
      building: "Executive Tower",
      unit_no: "1507",
      property_type: "office" as const,
      beds: 0,
      baths: 2,
      sqft: 1800,
      rent_yearly: 180000,
      cheques_accepted: 4,
      security_deposit: 9000,
      agency_fee: 9000,
      available_from: "2026-09-01",
      furnished: false,
      amenities: ["parking", "reception", "meeting_rooms"],
      cover_image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      status: "draft" as const,
      listed_by: IDS.owner,
      view_count: 12,
    },
  ];

  const { error } = await supabase.from("properties").insert(properties);
  if (error) throw new Error(`Properties: ${error.message}`);

  const images = [
    { id: IDS.image1, property_id: IDS.property1, url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", sort_order: 1 },
    { id: IDS.image2, property_id: IDS.property1, url: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800", sort_order: 2 },
    { id: IDS.image3, property_id: IDS.property3, url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", sort_order: 1 },
    { id: IDS.image4, property_id: IDS.property2, url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", sort_order: 1 },
    { id: IDS.image5, property_id: IDS.property4, url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", sort_order: 1 },
  ];

  const { error: imgError } = await supabase.from("property_images").insert(images);
  if (imgError) throw new Error(`Property images: ${imgError.message}`);
}

async function seedViewingsAndApplications() {
  console.log("Seeding viewings and applications...");

  const viewings = [
    {
      id: IDS.viewing1,
      property_id: IDS.property1,
      tenant_id: IDS.tenant2,
      agent_id: IDS.agent,
      scheduled_at: new Date(Date.now() + 2 * 86400000).toISOString(),
      status: "confirmed" as const,
      notes: "Interested in 4-cheque payment plan.",
    },
    {
      id: IDS.viewing2,
      property_id: IDS.property2,
      tenant_id: IDS.tenant3,
      agent_id: IDS.agent,
      scheduled_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      status: "completed" as const,
      feedback: "Liked the location; concerned about studio size.",
    },
    {
      id: IDS.viewing3,
      property_id: IDS.property4,
      tenant_id: IDS.tenant2,
      agent_id: IDS.agent,
      status: "requested" as const,
      notes: "Weekend viewing preferred.",
    },
  ];

  const { error: vError } = await supabase.from("viewings").insert(viewings);
  if (vError) throw new Error(`Viewings: ${vError.message}`);

  const applications = [
    {
      id: IDS.application1,
      property_id: IDS.property3,
      tenant_id: IDS.tenant1,
      agent_id: IDS.agent,
      status: "approved" as const,
      offer_amount: 450000,
      cheques_offered: 4,
      move_in_date: "2025-01-15",
      occupants: 3,
      employer: "Emirates NBD",
      monthly_income: 45000,
      notes: "Approved after document verification.",
    },
    {
      id: IDS.application2,
      property_id: IDS.property1,
      tenant_id: IDS.tenant2,
      agent_id: IDS.agent,
      status: "docs_review" as const,
      offer_amount: 115000,
      cheques_offered: 4,
      move_in_date: "2026-07-15",
      occupants: 2,
      employer: "Careem",
      monthly_income: 28000,
      notes: "Awaiting bank statement upload.",
    },
    {
      id: IDS.application3,
      property_id: IDS.property4,
      tenant_id: IDS.tenant2,
      agent_id: IDS.agent,
      status: "contract_sent" as const,
      offer_amount: 95000,
      cheques_offered: 4,
      move_in_date: "2026-08-01",
      occupants: 1,
      employer: "Self-employed",
      monthly_income: 22000,
    },
  ];

  const { error: aError } = await supabase.from("applications").insert(applications);
  if (aError) throw new Error(`Applications: ${aError.message}`);

  const docs = [
    {
      id: IDS.appDoc1,
      application_id: IDS.application1,
      doc_type: "emirates_id" as const,
      file_path: "applications/emirates-id-james.pdf",
      file_name: "emirates-id-james.pdf",
      uploaded_by: IDS.tenant1,
      verified: true,
      verified_by: IDS.agent,
      verified_at: new Date().toISOString(),
    },
    {
      id: IDS.appDoc2,
      application_id: IDS.application2,
      doc_type: "passport" as const,
      file_path: "applications/passport-sara.pdf",
      file_name: "passport-sara.pdf",
      uploaded_by: IDS.tenant2,
      verified: false,
    },
    {
      id: IDS.appDoc3,
      application_id: IDS.application3,
      doc_type: "salary_certificate" as const,
      file_path: "applications/salary-sara.pdf",
      file_name: "salary-certificate.pdf",
      uploaded_by: IDS.tenant2,
      verified: true,
      verified_by: IDS.agent,
      verified_at: new Date().toISOString(),
      notes: "Verified with employer HR.",
    },
  ];

  const { error: dError } = await supabase.from("application_documents").insert(docs);
  if (dError) throw new Error(`Application documents: ${dError.message}`);
}

async function seedTenanciesAndPayments() {
  console.log("Seeding tenancies and payments...");

  const tenancies = [
    {
      id: IDS.tenancy1,
      property_id: IDS.property3,
      tenant_id: IDS.tenant1,
      application_id: IDS.application1,
      start_date: "2025-01-15",
      end_date: "2026-01-14",
      annual_rent: 450000,
      cheques: 4,
      security_deposit: 22500,
      status: "active" as const,
      ejari_number: "EJ-2025-88421",
      ejari_status: "registered",
      contract_url: "contracts/tenancy-palm-villa.pdf",
    },
    {
      id: IDS.tenancy2,
      property_id: IDS.property4,
      tenant_id: IDS.tenant2,
      application_id: IDS.application3,
      start_date: "2026-08-01",
      end_date: "2027-07-31",
      annual_rent: 95000,
      cheques: 4,
      security_deposit: 4750,
      status: "upcoming" as const,
    },
    {
      id: IDS.tenancy3,
      property_id: IDS.property2,
      tenant_id: IDS.tenant3,
      start_date: "2024-06-01",
      end_date: "2025-05-31",
      annual_rent: 68000,
      cheques: 2,
      security_deposit: 3400,
      status: "ended" as const,
      ejari_number: "EJ-2024-11203",
      ejari_status: "expired",
    },
  ];

  const { error: tError } = await supabase.from("tenancies").insert(tenancies);
  if (tError) throw new Error(`Tenancies: ${tError.message}`);

  const payments = [
    {
      id: IDS.payment1,
      tenancy_id: IDS.tenancy1,
      due_date: "2025-01-15",
      amount: 112500,
      payment_type: "rent" as const,
      method: "cheque" as const,
      status: "cleared" as const,
      cheque_no: "CHQ-8842101",
      bank_name: "Emirates NBD",
      paid_at: "2025-01-14T10:00:00Z",
    },
    {
      id: IDS.payment2,
      tenancy_id: IDS.tenancy1,
      due_date: "2025-04-15",
      amount: 112500,
      payment_type: "rent" as const,
      method: "cheque" as const,
      status: "cleared" as const,
      cheque_no: "CHQ-8842102",
      bank_name: "Emirates NBD",
      paid_at: "2025-04-14T09:30:00Z",
    },
    {
      id: IDS.payment3,
      tenancy_id: IDS.tenancy1,
      due_date: "2025-07-15",
      amount: 112500,
      payment_type: "rent" as const,
      method: "cheque" as const,
      status: "pending" as const,
      cheque_no: "CHQ-8842103",
      bank_name: "Emirates NBD",
    },
    {
      id: IDS.payment4,
      tenancy_id: IDS.tenancy1,
      due_date: "2025-01-10",
      amount: 22500,
      payment_type: "security_deposit" as const,
      method: "bank_transfer" as const,
      status: "paid" as const,
      reference: "TRF-SD-88421",
      paid_at: "2025-01-10T14:00:00Z",
    },
    {
      id: IDS.payment5,
      tenancy_id: IDS.tenancy2,
      due_date: "2026-08-01",
      amount: 23750,
      payment_type: "rent" as const,
      method: "cheque" as const,
      status: "scheduled" as const,
    },
  ];

  const { error: pError } = await supabase.from("payments").insert(payments);
  if (pError) throw new Error(`Payments: ${pError.message}`);
}

async function seedMaintenanceComplaintsRenewals() {
  console.log("Seeding maintenance, complaints, and renewals...");

  const tickets = [
    {
      id: IDS.ticket1,
      tenancy_id: IDS.tenancy1,
      category: "HVAC",
      priority: "high" as const,
      status: "in_progress" as const,
      subject: "AC not cooling in master bedroom",
      description: "Tenant reports weak airflow and warm air since yesterday evening.",
      assigned_to: IDS.agent,
    },
    {
      id: IDS.ticket2,
      tenancy_id: IDS.tenancy1,
      category: "Plumbing",
      priority: "medium" as const,
      status: "resolved" as const,
      subject: "Kitchen sink leak",
      description: "Minor leak under sink — resolved by plumber.",
      assigned_to: IDS.agent,
      resolved_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
  ];

  const { error: tError } = await supabase.from("maintenance_tickets").insert(tickets);
  if (tError) throw new Error(`Maintenance tickets: ${tError.message}`);

  const updates = [
    {
      id: IDS.ticketUpdate1,
      ticket_id: IDS.ticket1,
      by_user: IDS.agent,
      note: "Technician scheduled for tomorrow 10 AM.",
    },
    {
      id: IDS.ticketUpdate2,
      ticket_id: IDS.ticket1,
      by_user: IDS.tenant1,
      note: "Please call 30 minutes before arrival.",
    },
  ];

  const { error: uError } = await supabase.from("maintenance_updates").insert(updates);
  if (uError) throw new Error(`Maintenance updates: ${uError.message}`);

  const { error: cError } = await supabase.from("complaints").insert({
    id: IDS.complaint1,
    tenancy_id: IDS.tenancy1,
    subject: "Noise from neighbouring renovation",
    description: "Loud drilling on weekday mornings before 9 AM.",
    severity: "medium" as const,
    status: "open" as const,
  });
  if (cError) throw new Error(`Complaints: ${cError.message}`);

  const renewals = [
    {
      id: IDS.renewal1,
      tenancy_id: IDS.tenancy1,
      current_rent: 450000,
      proposed_rent: 472500,
      proposed_cheques: 4,
      status: "offered" as const,
      offered_at: new Date().toISOString(),
      notes: "5% increase aligned with market index.",
    },
    {
      id: IDS.renewal2,
      tenancy_id: IDS.tenancy3,
      current_rent: 68000,
      proposed_rent: 72000,
      proposed_cheques: 2,
      status: "declined" as const,
      offered_at: "2025-04-01T00:00:00Z",
      responded_at: "2025-04-15T00:00:00Z",
      notes: "Tenant moved out at end of lease.",
    },
  ];

  const { error: rError } = await supabase.from("renewals").insert(renewals);
  if (rError) throw new Error(`Renewals: ${rError.message}`);
}

async function seedMessagesAndActivity() {
  console.log("Seeding messages and activity log...");

  const messages = [
    {
      id: IDS.message1,
      application_id: IDS.application2,
      sender_id: IDS.agent,
      body: "Hi Sara, please upload your latest bank statement to complete document review.",
    },
    {
      id: IDS.message2,
      application_id: IDS.application2,
      sender_id: IDS.tenant2,
      body: "Thanks Fatima — I will upload it by end of day.",
      read_at: new Date().toISOString(),
    },
    {
      id: IDS.message3,
      tenancy_id: IDS.tenancy1,
      sender_id: IDS.tenant1,
      body: "The AC issue is getting worse — any update on the technician?",
    },
  ];

  const { error: mError } = await supabase.from("messages").insert(messages);
  if (mError) throw new Error(`Messages: ${mError.message}`);

  const activities = [
    {
      id: IDS.activity1,
      actor_id: IDS.agent,
      entity_type: "application",
      entity_id: IDS.application2,
      action: "status_changed",
      meta: { from: "submitted", to: "docs_review" },
    },
    {
      id: IDS.activity2,
      actor_id: IDS.owner,
      entity_type: "property",
      entity_id: IDS.property5,
      action: "created",
      meta: { reference: "RF-BB-O15" },
    },
    {
      id: IDS.activity3,
      actor_id: IDS.agent,
      entity_type: "maintenance_ticket",
      entity_id: IDS.ticket1,
      action: "assigned",
      meta: { assignee: IDS.agent },
    },
  ];

  const { error: aError } = await supabase.from("activity_log").insert(activities);
  if (aError) throw new Error(`Activity log: ${aError.message}`);
}

async function main() {
  console.log("Rentflow database seed starting...\n");

  await clearSeedData();
  await createUsers();
  await seedProperties();
  await seedViewingsAndApplications();
  await seedTenanciesAndPayments();
  await seedMaintenanceComplaintsRenewals();
  await seedMessagesAndActivity();

  console.log("\nSeed complete.\n");
  console.log("Demo logins (password for all):", SEED_PASSWORD);
  for (const u of USERS) {
    console.log(`  ${u.role.padEnd(6)} ${u.email}`);
  }
  console.log("\nTables seeded: profiles, user_roles, agency_settings, properties, property_images,");
  console.log("viewings, applications, application_documents, tenancies, payments,");
  console.log("maintenance_tickets, maintenance_updates, complaints, renewals, messages, activity_log");
  console.log("(agency_branding is a view over agency_settings)");
}

main().catch((err) => {
  console.error("\nSeed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
