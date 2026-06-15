/**
 * Seed remote Supabase with demo data (service role).
 * Run: npm run db:seed
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import {
  SEED_TABLES,
  buildLeaveRequests,
  buildNotifications,
  buildPayslips,
  buildTimesheets,
  messageTemplates,
} from "./seed-data.mjs";
import { EXTENDED_SEED_ORDER, buildExtendedRows } from "./seed-data-modules.mjs";
import { seedDocumentStorage } from "./seed-storage.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const DEMO_STAFF = [
  { email: "manager@emiraxis.demo", password: "EmirAxis2026!", role: "manager", full_name: "Sarah Al Mazrouei", job_title: "Operations Manager" },
  { email: "recruiter@emiraxis.demo", password: "EmirAxis2026!", role: "recruiter", full_name: "Omar Hassan", job_title: "Senior Recruiter" },
  { email: "accountant@emiraxis.demo", password: "EmirAxis2026!", role: "accountant", full_name: "Priya Nair", job_title: "Finance Controller" },
];

function loadEnv() {
  const text = readFileSync(resolve(root, ".env"), "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1);
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "hello@iankatana.com";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "EmirAxis2026!";

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureUser({ email, password, full_name, role, job_title }) {
  const { data: list, error: listError } = await supabase.auth.admin.listUsers({ perPage: 200 });
  if (listError) throw listError;
  const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  let userId = existing?.id;
  if (!userId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });
    if (error) throw error;
    userId = data.user.id;
  }
  await supabase.from("user_roles").upsert({ user_id: userId, role }, { onConflict: "user_id,role" });
  await supabase.from("profiles").upsert(
    { id: userId, email, full_name, job_title, is_active: true },
    { onConflict: "id" },
  );
  return userId;
}

async function ensureAdminUser() {
  return ensureUser({
    email: adminEmail,
    password: adminPassword,
    full_name: "Ian katana",
    role: "admin",
    job_title: "Administrator",
  });
}

async function ensureDemoStaff() {
  const ids = {};
  for (const s of DEMO_STAFF) {
    const id = await ensureUser(s);
    ids[`${s.role}Id`] = id;
    console.log(`  user: ${s.email} (${s.role})`);
  }
  return ids;
}

async function seedTable(table, rows, { onConflict = "id" } = {}) {
  if (!rows?.length) return;
  const options = onConflict ? { onConflict } : {};
  const { error } = await supabase.from(table).upsert(rows, options);
  if (error && error.code !== "23505") throw new Error(`${table}: ${error.message}`);
  console.log(`  ${table}: ${rows.length} rows`);
}

async function main() {
  console.log("Ensuring users...");
  const adminUserId = await ensureAdminUser();
  console.log(`  admin: ${adminEmail}`);
  const staffIds = await ensureDemoStaff();

  const { error: brandErr } = await supabase
    .from("branding_settings")
    .update({
      company_name: "EmirAxis",
      short_name: "EmirAxis",
      tagline: "The command center for UAE workforce operations.",
      logo_url: "/assets/emiraxis-logo.png",
      logo_dark_url: "/assets/emiraxis-logo-white.png",
      favicon_url: "/assets/emiraxis-favicon.png",
      primary_color: "oklch(0.28 0.09 252)",
      accent_color: "oklch(0.78 0.13 85)",
      background_color: "oklch(0.985 0.005 85)",
      foreground_color: "oklch(0.2 0.04 252)",
      font_family: "Geist",
      font_display_family: "Geist",
      font_weights: "100;200;300",
    })
    .eq("singleton", true);
  if (brandErr) console.warn("  branding_settings:", brandErr.message);
  else console.log("  branding_settings: updated");

  console.log("\nSeeding core data...");
  for (const [table, getRows] of SEED_TABLES) {
    const conflict = table === "attendance" ? "worker_id,date" : "id";
    await seedTable(table, getRows(), { onConflict: conflict });
  }

  console.log("\nSeeding extended modules...");
  for (const [table, getRows] of EXTENDED_SEED_ORDER) {
    await seedTable(table, getRows());
  }
  for (const [table, getRows] of buildExtendedRows(adminUserId, staffIds)) {
    await seedTable(table, getRows());
  }

  console.log("\nSeeding HR & finance...");
  await seedTable("leave_requests", buildLeaveRequests(adminUserId));
  await seedTable("message_templates", messageTemplates);
  await seedTable("notifications", buildNotifications(adminUserId));
  await seedTable("payslips", buildPayslips(), { onConflict: "worker_id,period_year,period_month" });
  await seedTable("timesheets", buildTimesheets());

  console.log("\nUploading document storage placeholders...");
  await seedDocumentStorage(supabase, adminUserId);

  const tables = [
    ...SEED_TABLES.map(([t]) => t),
    ...EXTENDED_SEED_ORDER.map(([t]) => t),
    ...buildExtendedRows(adminUserId, staffIds).map(([t]) => t),
    "leave_requests",
    "message_templates",
    "notifications",
    "payslips",
    "timesheets",
  ];
  const unique = [...new Set(tables)];

  console.log("\nSeed complete.");
  console.log(`Tables seeded: ${unique.length}`);
  console.log("\nSign in (admin):", adminEmail);
  if (!process.env.SEED_ADMIN_PASSWORD) console.log("Password:", adminPassword);
  console.log("\nDemo staff (same password as admin unless SEED_ADMIN_PASSWORD set):");
  for (const s of DEMO_STAFF) console.log(`  ${s.role}: ${s.email}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
