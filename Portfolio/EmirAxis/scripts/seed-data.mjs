/** Demo seed records aligned with current Supabase schema (migrations). */
import { sid } from "./seed-ids.mjs";

export const clients = [
  { id: "333e63b3-af9b-4a79-9523-7aeca01b7db8", legal_name: "Emaar Hospitality Group LLC", trade_name: "Emaar Hospitality", industry: "Hospitality", country: "AE", emirate: "Dubai", city: "Downtown Dubai", email: "procurement@emaar.ae", phone: "+97144567890", billing_terms_days: 30, credit_limit: 500000, currency: "AED", status: "active" },
  { id: "744c5407-3632-4da1-af87-50cb1870c384", legal_name: "DP World UAE Region FZE", trade_name: "DP World", industry: "Logistics", country: "AE", emirate: "Dubai", city: "Jebel Ali", email: "staffing@dpworld.com", phone: "+97148810000", billing_terms_days: 45, credit_limit: 1200000, currency: "AED", status: "active" },
  { id: "32180d9f-0c03-4af5-a97e-b48d7d98e5a1", legal_name: "Aldar Properties PJSC", trade_name: "Aldar", industry: "Real Estate", country: "AE", emirate: "Abu Dhabi", city: "Yas Island", email: "hr@aldar.com", phone: "+97128109999", billing_terms_days: 30, credit_limit: 750000, currency: "AED", status: "active" },
  { id: "eba853ab-c226-4ec7-a863-e4e4c702caa4", legal_name: "Majid Al Futtaim Retail LLC", trade_name: "Carrefour MAF", industry: "Retail", country: "AE", emirate: "Dubai", city: "Deira", email: "careers@maf.ae", phone: "+97142943100", billing_terms_days: 30, credit_limit: 0, currency: "AED", status: "prospect" },
  { id: "f1859705-a8f4-472e-8d71-a5b14c2d5cc7", legal_name: "Etihad Airport Services", trade_name: "EAS", industry: "Aviation", country: "AE", emirate: "Abu Dhabi", city: "Abu Dhabi Intl", email: "ops@etihadairportservices.ae", phone: "+97125998888", billing_terms_days: 60, credit_limit: 900000, currency: "AED", status: "active" },
];

export const jobOrders = [
  { id: "40597068-2d9a-4c4d-9785-aebf959d0607", reference: "JO-2026-000001", client_id: "333e63b3-af9b-4a79-9523-7aeca01b7db8", title: "Housekeeping Attendants", category: "Hospitality", description: "50 housekeepers for Address Hotel pre-opening", quantity: 50, filled_count: 4, location: "Downtown", emirate: "Dubai", contract_type: "limited", start_date: "2026-06-15", working_hours_per_day: 9, pay_rate: 1500, bill_rate: 2400, currency: "AED", priority: "high", status: "in_progress", sla_days: 21, requirements: {} },
  { id: "9af038c3-c521-46dc-b134-bcbe0ff0a18c", reference: "JO-2026-000002", client_id: "744c5407-3632-4da1-af87-50cb1870c384", title: "Crane Operators", category: "Logistics", description: "Certified RTG crane operators for Jebel Ali Terminal 4", quantity: 12, filled_count: 1, location: "Jebel Ali", emirate: "Dubai", contract_type: "limited", start_date: "2026-06-08", working_hours_per_day: 9, pay_rate: 5500, bill_rate: 8200, currency: "AED", priority: "urgent", status: "open", sla_days: 14, requirements: {} },
  { id: "995ca835-3ac4-4d86-8bd6-5ad152f8bc4a", reference: "JO-2026-000003", client_id: "32180d9f-0c03-4af5-a97e-b48d7d98e5a1", title: "Security Guards (SIRA)", category: "Security", description: "30 SIRA-certified guards for Yas Mall", quantity: 30, filled_count: 0, location: "Yas Island", contract_type: "limited", start_date: "2026-07-01", working_hours_per_day: 9, pay_rate: 2200, bill_rate: 3500, currency: "AED", priority: "normal", status: "in_progress", sla_days: 14, requirements: {} },
  { id: "cf916b9e-5f76-4dd3-9edc-24123863c851", reference: "JO-2026-000004", client_id: "f1859705-a8f4-472e-8d71-a5b14c2d5cc7", title: "Baggage Handlers", category: "Aviation", quantity: 80, filled_count: 0, location: "AUH Terminal A", contract_type: "limited", start_date: "2026-06-22", working_hours_per_day: 9, pay_rate: 2800, bill_rate: 4200, currency: "AED", priority: "high", status: "draft", sla_days: 14, requirements: {} },
];

export const candidates = [
  { id: "2aa603b7-c38a-4980-aaaf-2a18818144ef", reference: "CN-26000001", full_name: "Rajesh Kumar", email: "rajesh.k@example.com", phone: "+919876543210", gender: "Male", nationality: "Indian", current_country: "India", languages: ["English", "Hindi"], skills: ["Housekeeping", "Front Desk"], years_experience: 6, expected_salary: 3500, status: "shortlisted" },
  { id: "beb0c9bb-2577-462a-b1ea-f0789bd2d0dc", reference: "CN-26000002", full_name: "Maria Santos", email: "maria.santos@example.com", phone: "+639171234567", gender: "Female", nationality: "Filipino", current_country: "Philippines", languages: ["English", "Tagalog"], skills: ["Waitress", "Barista"], years_experience: 4, expected_salary: 3000, status: "new" },
  { id: "bbb8496a-b86b-4a3b-8e46-12f94f0a7ac9", reference: "CN-26000003", full_name: "Ahmed Hassan", email: "ahmed.hassan@example.com", phone: "+201111223344", gender: "Male", nationality: "Egyptian", current_country: "UAE", languages: ["Arabic", "English"], skills: ["Driver", "Heavy Equipment"], years_experience: 9, expected_salary: 6000, status: "interviewing" },
  { id: "c7a62b69-3e50-4dfa-b4f3-5f39166adbd1", reference: "CN-26000004", full_name: "Priya Sharma", email: "priya.sharma@example.com", phone: "+919812345678", gender: "Female", nationality: "Indian", current_country: "India", languages: ["English", "Hindi"], skills: ["Receptionist", "Admin"], years_experience: 3, expected_salary: 2800, status: "screening" },
  { id: "ea613add-7fbc-4ffa-8e85-cedbcea57267", reference: "CN-26000005", full_name: "John Otieno", email: "john.otieno@example.com", phone: "+254712345678", gender: "Male", nationality: "Kenyan", current_country: "Kenya", languages: ["English", "Swahili"], skills: ["Security", "First Aid"], years_experience: 5, expected_salary: 3200, status: "offered" },
  { id: "a2271350-511d-4765-b037-26ee3e8c978a", reference: "CN-26000006", full_name: "Nguyen Linh", email: "linh.nguyen@example.com", phone: "+84909123456", gender: "Female", nationality: "Vietnamese", current_country: "Vietnam", languages: ["English", "Vietnamese"], skills: ["Spa Therapist"], years_experience: 2, expected_salary: 2500, status: "new" },
];

export const workers = [
  { id: "4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db", employee_code: "EMP000001", full_name: "Suresh Patel", nationality: "Indian", gender: "Male", passport_expiry: "2027-06-16", visa_expiry: "2026-12-18", labor_card_expiry: "2026-09-29", medical_expiry: "2026-07-16", department: "Hospitality", designation: "Housekeeping Attendant", joining_date: "2025-12-03", contract_start: "2025-12-03", contract_end: "2027-11-23", base_salary: 1200, housing_allowance: 300, transport_allowance: 200, currency: "AED", bank_name: "Emirates NBD", iban: "AE070331234567890123456", status: "active" },
  { id: "42172aa3-5199-431a-aba1-e334b7405705", employee_code: "EMP000002", full_name: "Fatima Begum", nationality: "Bangladeshi", gender: "Female", passport_expiry: "2028-05-21", visa_expiry: "2027-07-16", labor_card_expiry: "2026-06-19", medical_expiry: "2026-07-31", department: "Facilities", designation: "Cleaner", joining_date: "2026-02-26", contract_start: "2026-02-26", contract_end: "2028-02-26", base_salary: 1100, housing_allowance: 250, transport_allowance: 150, currency: "AED", bank_name: "ADCB", iban: "AE860030001122334455667", status: "active" },
  { id: "bef62375-4649-4e8f-a04d-f9c0f4506c65", employee_code: "EMP000003", full_name: "Mohammed Iqbal", nationality: "Pakistani", gender: "Male", passport_expiry: "2026-12-18", visa_expiry: "2026-11-28", labor_card_expiry: "2026-09-29", medical_expiry: "2027-02-06", department: "Logistics", designation: "Crane Operator", joining_date: "2025-06-01", contract_start: "2025-06-01", contract_end: "2027-06-01", base_salary: 4500, housing_allowance: 1200, transport_allowance: 600, currency: "AED", bank_name: "Mashreq", iban: "AE220330099887766554433", status: "active" },
  { id: "c74b802b-e34c-424a-8df2-1b5bdc2f22dc", employee_code: "EMP000004", full_name: "Daniel Mwangi", nationality: "Kenyan", gender: "Male", passport_expiry: "2028-05-01", visa_expiry: "2028-05-01", labor_card_expiry: "2028-05-01", medical_expiry: "2028-05-01", department: "Security", designation: "Security Guard", joining_date: "2026-05-18", contract_start: "2026-05-18", contract_end: "2028-05-17", base_salary: 1800, housing_allowance: 400, transport_allowance: 200, currency: "AED", bank_name: "FAB", iban: "AE100354512345678901234", status: "onboarding" },
  { id: "435c25a3-1b0f-42f4-9645-81e2b77b34ce", employee_code: "EMP000005", full_name: "Aliya Khan", nationality: "Indian", gender: "Female", passport_expiry: "2029-02-25", visa_expiry: "2027-03-08", labor_card_expiry: "2027-10-14", medical_expiry: "2027-04-17", department: "Admin", designation: "Receptionist", joining_date: "2024-06-01", contract_start: "2025-06-01", contract_end: "2027-06-01", base_salary: 2200, housing_allowance: 600, transport_allowance: 300, currency: "AED", bank_name: "Emirates NBD", iban: "AE070331234567899876543", status: "active" },
];

export const placements = [
  { id: "b34c83de-d66c-462a-9b62-2e04e323e052", worker_id: "bef62375-4649-4e8f-a04d-f9c0f4506c65", job_order_id: "9af038c3-c521-46dc-b134-bcbe0ff0a18c", client_id: "744c5407-3632-4da1-af87-50cb1870c384", start_date: "2026-05-02", pay_rate: 5500, bill_rate: 8200, currency: "AED", status: "active" },
  { id: "3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8", worker_id: "4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db", job_order_id: "40597068-2d9a-4c4d-9785-aebf959d0607", client_id: "333e63b3-af9b-4a79-9523-7aeca01b7db8", start_date: "2026-03-03", end_date: "2027-02-26", pay_rate: 45, bill_rate: 75, currency: "AED", status: "confirmed" },
  { id: "403a3624-2f50-476e-b536-4eaf50557e09", worker_id: "42172aa3-5199-431a-aba1-e334b7405705", job_order_id: "40597068-2d9a-4c4d-9785-aebf959d0607", client_id: "333e63b3-af9b-4a79-9523-7aeca01b7db8", start_date: "2026-03-03", end_date: "2027-02-26", pay_rate: 45, bill_rate: 75, currency: "AED", status: "confirmed" },
  { id: "feccebbd-adf0-4574-ad90-df034b3ab5e9", worker_id: "c74b802b-e34c-424a-8df2-1b5bdc2f22dc", job_order_id: "40597068-2d9a-4c4d-9785-aebf959d0607", client_id: "333e63b3-af9b-4a79-9523-7aeca01b7db8", start_date: "2026-03-03", end_date: "2027-02-26", pay_rate: 45, bill_rate: 75, currency: "AED", status: "confirmed" },
  { id: "8d198a66-25d7-4448-986b-1272048a8780", worker_id: "435c25a3-1b0f-42f4-9645-81e2b77b34ce", job_order_id: "40597068-2d9a-4c4d-9785-aebf959d0607", client_id: "333e63b3-af9b-4a79-9523-7aeca01b7db8", start_date: "2026-03-03", end_date: "2027-02-26", pay_rate: 45, bill_rate: 75, currency: "AED", status: "confirmed" },
];

let attendanceSeq = 0;
function attendanceId() {
  attendanceSeq += 1;
  return sid(0x1007, attendanceSeq);
}

export function buildAttendance() {
  attendanceSeq = 0;
  const rows = [];
  const siteWorkers = [
    { worker_id: "4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db", placement_id: "3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8" },
    { worker_id: "42172aa3-5199-431a-aba1-e334b7405705", placement_id: "403a3624-2f50-476e-b536-4eaf50557e09" },
    { worker_id: "bef62375-4649-4e8f-a04d-f9c0f4506c65", placement_id: "b34c83de-d66c-462a-9b62-2e04e323e052" },
    { worker_id: "c74b802b-e34c-424a-8df2-1b5bdc2f22dc", placement_id: "feccebbd-adf0-4574-ad90-df034b3ab5e9" },
    { worker_id: "435c25a3-1b0f-42f4-9645-81e2b77b34ce", placement_id: "8d198a66-25d7-4448-986b-1272048a8780" },
  ];
  for (let d = 19; d <= 31; d++) {
    const date = `2026-05-${String(d).padStart(2, "0")}`;
    for (const sw of siteWorkers) {
      const off = d === 22 || d === 29;
      rows.push({
        id: attendanceId(),
        worker_id: sw.worker_id,
        placement_id: sw.placement_id,
        date,
        status: off ? "off" : "present",
        hours: off ? 0 : 9,
        overtime_hours: off ? 0 : d % 3 === 0 ? 2 : 0,
        location: "Dubai Marina Site",
      });
    }
  }
  rows.push({
    id: attendanceId(),
    worker_id: "4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db",
    placement_id: "3cbb6d63-d3c0-4c55-8ea3-da742b5a3ba8",
    date: "2026-06-01",
    status: "present",
    hours: 9,
    overtime_hours: 0,
    location: "Dubai Marina Site",
  });
  return rows;
}

export const invoices = [
  { id: "41baf9dc-c48d-443f-8dcf-efd50f50dc86", reference: "INV-2026-000013", client_id: "333e63b3-af9b-4a79-9523-7aeca01b7db8", period_start: "2026-05-02", period_end: "2026-06-01", issue_date: "2026-06-01", due_date: "2026-07-01", status: "sent", subtotal: 13500, vat_rate: 5, vat_amount: 675, total: 14175, amount_paid: 5000, currency: "AED", notes: "Monthly staffing services" },
  { id: "58b4c321-816d-4eba-a742-5b569cdf5080", reference: "INV-2026-000014", client_id: "744c5407-3632-4da1-af87-50cb1870c384", period_start: "2026-05-02", period_end: "2026-06-01", issue_date: "2026-06-01", due_date: "2026-07-01", status: "sent", subtotal: 13500, vat_rate: 5, vat_amount: 675, total: 14175, amount_paid: 0, currency: "AED", notes: "Monthly staffing services" },
  { id: "710f5359-5f37-4206-8eb2-31c159e2237c", reference: "INV-2026-000022", client_id: "333e63b3-af9b-4a79-9523-7aeca01b7db8", period_start: "2026-02-01", period_end: "2026-03-03", issue_date: "2026-03-03", due_date: "2026-04-02", status: "overdue", subtotal: 13500, vat_rate: 5, vat_amount: 675, total: 14175, amount_paid: 0, currency: "AED", notes: "Monthly staffing services" },
];

export const invoiceLines = invoices.map((inv) => ({
  invoice_id: inv.id,
  description: "Hours billed",
  hours: 180,
  rate: 75,
  amount: 13500,
}));

export const issues = [
  { id: sid(0x1001, 1), worker_id: "4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db", category: "welfare", severity: "high", status: "resolved", title: "Medical card missing", description: "Worker reported missing medical fitness card on site.", resolution: "Card re-issued after clinic visit." },
  { id: sid(0x1001, 2), worker_id: "bef62375-4649-4e8f-a04d-f9c0f4506c65", category: "transport", severity: "medium", status: "in_progress", title: "Visa stamping needed", description: "Passport held at PRO — stamping appointment pending." },
  { id: sid(0x1001, 3), worker_id: "435c25a3-1b0f-42f4-9645-81e2b77b34ce", category: "hr", severity: "high", status: "open", title: "Site PPE shortage", description: "Insufficient safety boots for night shift team." },
];

export function buildLeaveRequests(adminUserId) {
  return [
    { id: sid(0x1002, 1), worker_id: "bef62375-4649-4e8f-a04d-f9c0f4506c65", leave_type: "annual", start_date: "2026-06-08", end_date: "2026-06-15", days: 7, reason: "Family visit", status: "pending" },
    { id: sid(0x1002, 2), worker_id: "42172aa3-5199-431a-aba1-e334b7405705", leave_type: "sick", start_date: "2026-05-02", end_date: "2026-05-04", days: 3, reason: "Flu - medical attached", status: "approved", decided_by: adminUserId, decided_at: new Date().toISOString(), decision_note: "Approved" },
    { id: sid(0x1002, 3), worker_id: "4facb9c0-4b4c-4776-a59c-5bc9b0f8a7db", leave_type: "annual", start_date: "2026-06-08", end_date: "2026-06-15", days: 7, reason: "Family visit", status: "rejected", decided_by: adminUserId, decided_at: new Date().toISOString(), decision_note: "Peak season" },
    { id: sid(0x1002, 4), worker_id: "435c25a3-1b0f-42f4-9645-81e2b77b34ce", leave_type: "emergency", start_date: "2026-06-20", end_date: "2026-06-22", days: 3, reason: "Family emergency", status: "pending" },
  ];
}

export const messageTemplates = [
  { id: sid(0x1003, 1), name: "Medical Appointment Reminder", channel: "whatsapp", category: "medical", body: "Dear {{name}}, your medical appointment is scheduled at {{center}} on {{date}}. Please bring your passport copy.", is_active: true },
  { id: sid(0x1003, 2), name: "Visa Renewal Reminder", channel: "whatsapp", category: "visa", body: "Dear {{name}}, your visa expires on {{date}}. Please submit your passport for renewal.", is_active: true },
  { id: sid(0x1003, 3), name: "Payslip Issued", channel: "whatsapp", category: "payroll", body: "Dear {{name}}, your payslip for {{month}} has been issued. Net pay: AED {{net}}.", is_active: true },
  { id: sid(0x1003, 4), name: "Airport pickup confirmation", channel: "sms", category: "transport", body: "Welcome {{name}}. Your pickup at {{terminal}} is confirmed for {{time}}.", is_active: true },
];

export function buildNotifications(adminUserId) {
  return [
    { id: sid(0x1004, 1), user_id: adminUserId, title: "Pending leave approvals", body: "4 requests awaiting decision", link: "/leave-approvals", category: "approval" },
    { id: sid(0x1004, 2), user_id: adminUserId, title: "Overdue invoices", body: "You have overdue invoice(s)", link: "/invoices", category: "finance" },
    { id: sid(0x1004, 3), user_id: adminUserId, title: "Welcome to EmirAxis", body: "Your workspace is ready. Explore dashboards and manage placements.", link: "/dashboard", category: "system" },
    { id: sid(0x1004, 4), user_id: adminUserId, title: "Documents expiring soon", body: "Review compliance expiries in Documents", link: "/documents", category: "compliance" },
    { id: sid(0x1004, 5), user_id: adminUserId, title: "Airport pickup scheduled", body: "PR659 arrival 12 Jun — driver assigned", link: "/airport-pickups", category: "operations" },
  ];
}

export function buildPayslips() {
  const rows = [];
  let seq = 0;
  for (const w of workers) {
    for (const month of [4, 5, 6]) {
      seq += 1;
      rows.push({
        id: sid(0x1005, seq),
        worker_id: w.id,
        period_year: 2026,
        period_month: month,
        gross: 7000,
        deductions: 450,
        net: 6550,
        currency: "AED",
        status: month === 6 ? "draft" : "paid",
        line_items: [
          { label: "Basic", amount: 5500 },
          { label: "Housing", amount: 1000 },
          { label: "Transport", amount: 500 },
        ],
      });
    }
  }
  return rows;
}

export function buildTimesheets() {
  return placements
    .filter((p) => p.client_id === "333e63b3-af9b-4a79-9523-7aeca01b7db8")
    .map((p, i) => ({
      id: sid(0x1006, i + 1),
      worker_id: p.worker_id,
      placement_id: p.id,
      client_id: p.client_id,
      period_start: "2026-06-01",
      period_end: "2026-06-30",
      total_hours: 180,
      overtime_hours: 8,
      total_amount: 13500,
      currency: "AED",
      status: "approved",
    }));
}

export const SEED_TABLES = [
  ["clients", () => clients],
  ["job_orders", () => jobOrders],
  ["candidates", () => candidates],
  ["workers", () => workers],
  ["placements", () => placements],
  ["attendance", buildAttendance],
  ["invoices", () => invoices],
  ["invoice_lines", () => invoiceLines],
  ["issues", () => issues],
];
