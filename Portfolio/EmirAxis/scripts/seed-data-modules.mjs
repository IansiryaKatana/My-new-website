/**
 * Extended demo seed for all operational modules (FK-safe IDs).
 */
import { clients, jobOrders, candidates, workers, placements, invoices, issues } from "./seed-data.mjs";
import { sid } from "./seed-ids.mjs";

const W = {
  suresh: workers[0].id,
  fatima: workers[1].id,
  iqbal: workers[2].id,
  daniel: workers[3].id,
  aliya: workers[4].id,
};
const C = {
  emaar: clients[0].id,
  dpw: clients[1].id,
  aldar: clients[2].id,
  maf: clients[3].id,
  eas: clients[4].id,
};
const CN = {
  rajesh: candidates[0].id,
  maria: candidates[1].id,
  ahmed: candidates[2].id,
  priya: candidates[3].id,
  john: candidates[4].id,
  linh: candidates[5].id,
};
const JO = {
  hk: jobOrders[0].id,
  crane: jobOrders[1].id,
  security: jobOrders[2].id,
  baggage: jobOrders[3].id,
};

export const clientContacts = [
  { id: sid(0x2001, 1), client_id: C.emaar, name: "Layla Al Mansoori", role_title: "HR Director", email: "layla.m@emaar.ae", phone: "+97144567891", is_primary: true },
  { id: sid(0x2001, 2), client_id: C.dpw, name: "James Okonkwo", role_title: "Operations Manager", email: "j.okonkwo@dpworld.com", phone: "+97148810001", is_primary: true },
  { id: sid(0x2001, 3), client_id: C.aldar, name: "Fatima Al Ketbi", role_title: "Procurement Lead", email: "f.ketbi@aldar.com", phone: "+97128109990", is_primary: true },
  { id: sid(0x2001, 4), client_id: C.maf, name: "Carlos Mendez", role_title: "Talent Partner", email: "carlos.m@maf.ae", phone: "+97142943101", is_primary: true },
];

export const accommodations = [
  { id: sid(0x2002, 1), name: "Sonapur Staff Camp A", address: "Sonapur Industrial, Dubai", city: "Dubai", emirate: "Dubai", building_type: "labor_camp", monthly_rent: 45000, is_active: true, notes: "Primary camp for hospitality workers" },
  { id: sid(0x2002, 2), name: "Jebel Ali Workers Residence", address: "JAFZA South", city: "Dubai", emirate: "Dubai", building_type: "apartment", monthly_rent: 38000, is_active: true },
];

export const accommodationRooms = [
  { id: sid(0x2003, 1), accommodation_id: accommodations[0].id, room_no: "101", floor: "1", capacity: 4 },
  { id: sid(0x2003, 2), accommodation_id: accommodations[0].id, room_no: "102", floor: "1", capacity: 4 },
  { id: sid(0x2003, 3), accommodation_id: accommodations[0].id, room_no: "201", floor: "2", capacity: 4 },
  { id: sid(0x2003, 4), accommodation_id: accommodations[1].id, room_no: "A-12", floor: "G", capacity: 6 },
];

export const vehicles = [
  { id: sid(0x2004, 1), plate_no: "DXB-48291", make: "Toyota", model: "Hiace", capacity: 14, registration_expiry: "2026-12-01", insurance_expiry: "2026-11-15", is_active: true },
  { id: sid(0x2004, 2), plate_no: "AUH-77102", make: "Nissan", model: "Urvan", capacity: 12, registration_expiry: "2027-03-20", insurance_expiry: "2027-01-10", is_active: true },
  { id: sid(0x2004, 3), plate_no: "DXB-90331", make: "Mercedes", model: "Sprinter", capacity: 18, registration_expiry: "2026-09-30", insurance_expiry: "2026-08-28", is_active: true },
];

export const drivers = [
  { id: sid(0x2005, 1), full_name: "Rashid Al Nuaimi", phone: "+971501112233", license_no: "DL-884422", license_expiry: "2027-05-10", vehicle_id: vehicles[0].id, is_active: true },
  { id: sid(0x2005, 2), full_name: "Imran Siddiqui", phone: "+971502223344", license_no: "DL-991133", license_expiry: "2026-11-20", vehicle_id: vehicles[1].id, is_active: true },
];

export const recruitmentAgents = [
  { id: sid(0x2006, 1), name: "Gulf Talent Partners", country: "India", contact_person: "Vikram Singh", email: "vikram@gulftalent.in", phone: "+919988776655", whatsapp: "+919988776655", commission_pct: 8, is_active: true },
  { id: sid(0x2006, 2), name: "Manila Workforce Agency", country: "Philippines", contact_person: "Grace Reyes", email: "grace@manilawfa.ph", phone: "+639178889900", commission_pct: 10, is_active: true },
];

export const inventoryItems = [
  { id: sid(0x2007, 1), name: "Safety boots (size 42)", sku: "PPE-BOOT-42", category: "PPE", stock_qty: 48, low_stock_threshold: 10, supplier: "SafeStep UAE", is_active: true },
  { id: sid(0x2007, 2), name: "High-vis vest", sku: "PPE-VEST", category: "PPE", stock_qty: 120, low_stock_threshold: 25, supplier: "SafeStep UAE", is_active: true },
  { id: sid(0x2007, 3), name: "Uniform shirt (L)", sku: "UNI-SHIRT-L", category: "Uniform", stock_qty: 8, low_stock_threshold: 15, supplier: "StitchPro", is_active: true },
];

export function buildBedAssignments() {
  return [
    { id: sid(0x2008, 1), room_id: accommodationRooms[0].id, worker_id: W.suresh, bed_no: "A", check_in: "2025-12-05", is_active: true },
    { id: sid(0x2008, 2), room_id: accommodationRooms[0].id, worker_id: W.fatima, bed_no: "B", check_in: "2026-02-28", is_active: true },
    { id: sid(0x2008, 3), room_id: accommodationRooms[2].id, worker_id: W.iqbal, bed_no: "A", check_in: "2025-06-05", is_active: true },
    { id: sid(0x2008, 4), room_id: accommodationRooms[3].id, worker_id: W.daniel, bed_no: "C", check_in: "2026-05-20", is_active: true },
  ];
}

export function buildDocuments(adminUserId) {
  const docs = [
    { worker_id: W.suresh, category: "passport", title: "Passport — Suresh Patel", file_name: "passport.pdf", expiry_date: "2027-06-16" },
    { worker_id: W.suresh, category: "visa", title: "Employment visa", file_name: "visa.pdf", expiry_date: "2026-12-18" },
    { worker_id: W.suresh, category: "emirates_id", title: "Emirates ID", file_name: "eid.pdf", expiry_date: "2027-06-16" },
    { worker_id: W.fatima, category: "passport", title: "Passport — Fatima", file_name: "passport.pdf", expiry_date: "2028-05-21" },
    { worker_id: W.fatima, category: "labor_card", title: "Labor card", file_name: "labor.pdf", expiry_date: "2026-06-19" },
    { worker_id: W.iqbal, category: "medical", title: "Medical fitness", file_name: "medical.pdf", expiry_date: "2027-02-06" },
    { worker_id: W.iqbal, category: "insurance", title: "Health insurance", file_name: "insurance.pdf", expiry_date: "2027-02-06" },
    { worker_id: W.aliya, category: "contract", title: "Signed employment contract", file_name: "contract.pdf", expiry_date: null },
    { worker_id: W.daniel, category: "certificate", title: "SIRA certificate", file_name: "sira.pdf", expiry_date: "2027-05-01" },
  ];
  return docs.map((d, i) => ({
    id: sid(0x2009, i + 1),
    worker_id: d.worker_id,
    category: d.category,
    title: d.title,
    file_path: `${d.worker_id}/${d.category}-seed.pdf`,
    file_name: d.file_name,
    mime_type: "application/pdf",
    size_bytes: 245000,
    expiry_date: d.expiry_date,
    uploaded_by: adminUserId,
  }));
}

export function buildCandidateDocuments(adminUserId) {
  return [
    { id: sid(0x200a, 1), candidate_id: CN.rajesh, doc_type: "passport", file_path: `${CN.rajesh}/passport.pdf`, file_name: "passport.pdf", mime_type: "application/pdf", expiry_date: "2028-01-15", uploaded_by: adminUserId },
    { id: sid(0x200a, 2), candidate_id: CN.maria, doc_type: "cv", file_path: `${CN.maria}/cv.pdf`, file_name: "cv.pdf", mime_type: "application/pdf", uploaded_by: adminUserId },
    { id: sid(0x200a, 3), candidate_id: CN.john, doc_type: "police_clearance", file_path: `${CN.john}/police.pdf`, file_name: "police.pdf", mime_type: "application/pdf", expiry_date: "2026-12-01", uploaded_by: adminUserId },
  ];
}

export function buildMedicalRecords(adminUserId) {
  return [
    { id: sid(0x200b, 1), worker_id: W.daniel, medical_center: "DHA Al Karama Medical Fitness", appointment_at: "2026-06-10T08:30:00.000Z", status: "booked", transport_pickup: "Sonapur Camp Gate 2", created_by: adminUserId },
    { id: sid(0x200b, 2), worker_id: W.fatima, medical_center: "SEHA Clinic Jebel Ali", appointment_at: "2026-05-20T07:00:00.000Z", status: "passed", result_date: "2026-05-20", cost: 320, created_by: adminUserId },
    { id: sid(0x200b, 3), worker_id: W.suresh, medical_center: "Mediclinic City Hospital", appointment_at: "2026-04-15T09:00:00.000Z", status: "certified", result_date: "2026-04-15", cost: 350, created_by: adminUserId },
    { id: sid(0x200b, 4), worker_id: W.iqbal, medical_center: "DHA Al Qusais", status: "required", created_by: adminUserId },
  ];
}

export function buildVisaRecords(adminUserId) {
  const stages = [
    { worker_id: W.daniel, stage: "entry_permit", status: "in_progress", scheduled_date: "2026-06-12", reference_no: "EP-2026-8841" },
    { worker_id: W.daniel, stage: "medical_booked", status: "pending", scheduled_date: "2026-06-10" },
    { worker_id: W.fatima, stage: "visa_stamping", status: "in_progress", scheduled_date: "2026-06-18", reference_no: "VS-2026-2210" },
    { worker_id: W.suresh, stage: "activated", status: "done", completed_date: "2025-12-01", uid_no: "UID-998877" },
    { worker_id: W.suresh, stage: "renewal_pending", status: "pending", scheduled_date: "2026-11-01" },
    { worker_id: W.iqbal, stage: "emirates_id", status: "done", completed_date: "2025-08-10" },
    { worker_id: W.iqbal, stage: "labour_contract", status: "done", completed_date: "2025-06-15" },
    { worker_id: W.aliya, stage: "activated", status: "done", completed_date: "2024-06-05" },
  ];
  return stages.map((s, i) => ({
    id: sid(0x200c, i + 1),
    worker_id: s.worker_id,
    stage: s.stage,
    status: s.status,
    scheduled_date: s.scheduled_date ?? null,
    completed_date: s.completed_date ?? null,
    reference_no: s.reference_no ?? null,
    uid_no: s.uid_no ?? null,
    sponsor: "EmirAxis Staffing LLC",
    visa_type: "employment",
    cost: s.status === "done" ? 1200 : 450,
    created_by: adminUserId,
  }));
}

export function buildWarningLetters(adminUserId) {
  return [
    { id: sid(0x200d, 1), worker_id: W.iqbal, client_id: C.dpw, warning_type: "verbal", reason: "Late arrival to site", incident_date: "2026-05-10", follow_up_date: "2026-06-10", status: "acknowledged", issued_by: adminUserId, issued_at: "2026-05-11T10:00:00.000Z" },
    { id: sid(0x200d, 2), worker_id: W.suresh, client_id: C.emaar, warning_type: "first_written", reason: "Uniform policy breach", incident_date: "2026-04-22", status: "issued", issued_by: adminUserId, issued_at: "2026-04-23T09:00:00.000Z" },
  ];
}

export function buildProTasks(adminUserId, staffIds) {
  const assignee = staffIds?.managerId ?? adminUserId;
  return [
    { id: sid(0x200e, 1), title: "Entry permit — Daniel Mwangi", task_type: "entry_permit", worker_id: W.daniel, status: "in_progress", due_date: "2026-06-15", assigned_to: assignee, reference_no: "PRO-2026-101", cost: 850, created_by: adminUserId },
    { id: sid(0x200e, 2), title: "Visa stamping — Fatima Begum", task_type: "visa_stamping", worker_id: W.fatima, status: "open", due_date: "2026-06-20", assigned_to: assignee, reference_no: "PRO-2026-102", created_by: adminUserId },
    { id: sid(0x200e, 3), title: "Emirates ID renewal batch", task_type: "emirates_id", worker_id: W.suresh, status: "submitted", due_date: "2026-07-01", assigned_to: assignee, created_by: adminUserId },
    { id: sid(0x200e, 4), title: "Offer letter — Rajesh Kumar", task_type: "offer_letter", candidate_id: CN.rajesh, client_id: C.emaar, status: "done", completed_at: "2026-05-28T14:00:00.000Z", created_by: adminUserId },
  ];
}

export function buildInternalTasks(adminUserId, staffIds) {
  const assignee = staffIds?.recruiterId ?? adminUserId;
  return [
    { id: sid(0x200f, 1), title: "Shortlist 10 housekeepers for Emaar", description: "Review CN pool and schedule interviews", status: "in_progress", priority: "high", due_date: "2026-06-08", assigned_to: assignee, related_client_id: C.emaar, related_job_order_id: JO.hk, created_by: adminUserId },
    { id: sid(0x200f, 2), title: "Collect passports for visa run", status: "todo", priority: "urgent", due_date: "2026-06-05", assigned_to: adminUserId, related_worker_id: W.fatima, created_by: adminUserId },
    { id: sid(0x200f, 3), title: "Update DP World rate card", status: "done", priority: "medium", completed_at: "2026-05-25T16:00:00.000Z", related_client_id: C.dpw, created_by: adminUserId },
  ];
}

export function buildAssetIssuances(adminUserId) {
  return [
    { id: sid(0x2010, 1), worker_id: W.suresh, item_name: "Safety boots", category: "PPE", size: "42", quantity: 1, status: "issued", issue_date: "2025-12-05", acknowledged: true, issued_by: adminUserId },
    { id: sid(0x2010, 2), worker_id: W.daniel, item_name: "High-vis vest", category: "PPE", quantity: 1, status: "issued", issue_date: "2026-05-20", acknowledged: false, issued_by: adminUserId },
    { id: sid(0x2010, 3), worker_id: W.iqbal, item_name: "Uniform set", category: "Uniform", quantity: 2, status: "returned", issue_date: "2025-06-01", return_date: "2026-01-15", acknowledged: true, issued_by: adminUserId },
  ];
}

export function buildInventoryTransactions(adminUserId) {
  return [
    { id: sid(0x2011, 1), item_id: inventoryItems[0].id, txn_type: "out", quantity: 2, worker_id: W.daniel, reference: "ISSUE-2026-044", recorded_by: adminUserId, notes: "Onboarding kit" },
    { id: sid(0x2011, 2), item_id: inventoryItems[1].id, txn_type: "in", quantity: 50, reference: "PO-8821", recorded_by: adminUserId, notes: "Restock delivery" },
    { id: sid(0x2011, 3), item_id: inventoryItems[2].id, txn_type: "out", quantity: 5, worker_id: W.suresh, reference: "ISSUE-2026-038", recorded_by: adminUserId },
  ];
}

export function buildTransportRoutes() {
  return [
    { id: sid(0x2012, 1), name: "Sonapur → Downtown Emaar", client_id: C.emaar, vehicle_id: vehicles[0].id, driver_id: drivers[0].id, pickup_point: "Sonapur Camp A", dropoff_point: "Address Hotel Downtown", shift: "morning", is_active: true },
    { id: sid(0x2012, 2), name: "Jebel Ali → DP World T4", client_id: C.dpw, vehicle_id: vehicles[2].id, driver_id: drivers[1].id, pickup_point: "JAFZA Residence", dropoff_point: "Terminal 4 Gate 7", shift: "night", is_active: true },
  ];
}

export function buildIncidents(adminUserId) {
  return [
    { id: sid(0x2013, 1), incident_type: "injury", status: "investigating", description: "Minor finger cut during equipment handling — first aid applied on site.", location: "Jebel Ali Terminal 4", occurred_at: "2026-05-28T14:30:00.000Z", worker_id: W.iqbal, client_id: C.dpw, witnesses: "Supervisor: Ahmed K.", action_taken: "Referred to clinic", reported_by: adminUserId },
    { id: sid(0x2013, 2), incident_type: "misconduct", status: "open", description: "Verbal dispute between workers in accommodation.", location: "Sonapur Camp A", occurred_at: "2026-05-30T21:00:00.000Z", worker_id: W.suresh, reported_by: adminUserId },
    { id: sid(0x2013, 3), incident_type: "site_accident", status: "resolved", description: "Slip on wet floor — no major injury.", location: "Yas Mall loading bay", occurred_at: "2026-04-12T09:15:00.000Z", worker_id: W.fatima, client_id: C.aldar, action_taken: "Safety briefing conducted", reported_by: adminUserId },
  ];
}

export function buildCommunicationLogs(adminUserId) {
  return [
    { id: sid(0x2014, 1), channel: "whatsapp", direction: "outbound", subject: "Medical appointment reminder", body: "Your medical is booked for 10 June at 8:30 AM.", worker_id: W.daniel, contacted_at: "2026-06-01T07:00:00.000Z", created_by: adminUserId },
    { id: sid(0x2014, 2), channel: "email", direction: "outbound", subject: "Invoice INV-2026-000013", body: "Please find attached invoice for May staffing period.", client_id: C.emaar, contacted_at: "2026-06-01T10:00:00.000Z", created_by: adminUserId },
    { id: sid(0x2014, 3), channel: "phone", direction: "inbound", subject: "Candidate follow-up", body: "Maria Santos confirmed interview slot.", candidate_id: CN.maria, contacted_at: "2026-05-31T15:30:00.000Z", created_by: adminUserId },
  ];
}

export function buildContractDocuments(adminUserId) {
  return [
    { id: sid(0x2015, 1), doc_type: "employment_contract", title: "Employment contract — Suresh Patel", worker_id: W.suresh, client_id: C.emaar, issued_date: "2025-12-01", signed: true, created_by: adminUserId },
    { id: sid(0x2015, 2), doc_type: "offer_letter", title: "Offer letter — Rajesh Kumar", client_id: C.emaar, issued_date: "2026-05-20", signed: false, body: "Draft offer for CN-26000001", created_by: adminUserId },
    { id: sid(0x2015, 3), doc_type: "deployment_letter", title: "Deployment letter — Mohammed Iqbal", worker_id: W.iqbal, client_id: C.dpw, issued_date: "2025-06-01", signed: true, created_by: adminUserId },
  ];
}

export function buildAirportPickups(adminUserId) {
  return [
    { id: sid(0x2016, 1), candidate_id: CN.maria, airline: "Philippine Airlines", flight_no: "PR659", terminal: "T1", arrival_at: "2026-06-12T18:45:00.000Z", status: "arranged", driver_id: drivers[0].id, vehicle_id: vehicles[0].id, accommodation_id: accommodations[0].id, created_by: adminUserId },
    { id: sid(0x2016, 2), candidate_id: CN.rajesh, airline: "Emirates", flight_no: "EK504", terminal: "T3", arrival_at: "2026-06-18T06:20:00.000Z", status: "pending", created_by: adminUserId },
    { id: sid(0x2016, 3), worker_id: W.daniel, airline: "Kenya Airways", flight_no: "KQ310", terminal: "T1", arrival_at: "2026-05-17T22:10:00.000Z", status: "completed", driver_id: drivers[1].id, vehicle_id: vehicles[1].id, accommodation_id: accommodations[0].id, created_by: adminUserId },
  ];
}

export function buildPayments(adminUserId) {
  return [
    { id: sid(0x2017, 1), invoice_id: invoices[0].id, amount: 5000, paid_on: "2026-06-05", method: "bank_transfer", reference: "TT-EMAAR-0506", recorded_by: adminUserId, notes: "Partial payment" },
  ];
}

export function buildIssueComments(adminUserId) {
  return [
    { id: sid(0x2018, 1), issue_id: issues[0].id, author_id: adminUserId, body: "Clinic visit completed — awaiting card print." },
    { id: sid(0x2018, 2), issue_id: issues[1].id, author_id: adminUserId, body: "PRO appointment booked for 18 June." },
  ];
}

export function buildAuditLog(adminUserId) {
  return [
    { id: sid(0x2019, 1), action: "worker.created", entity_type: "workers", entity_id: W.daniel, actor_id: adminUserId, metadata: { source: "seed" } },
    { id: sid(0x2019, 2), action: "invoice.sent", entity_type: "invoices", entity_id: invoices[0].id, actor_id: adminUserId, metadata: { reference: invoices[0].reference } },
    { id: sid(0x2019, 3), action: "placement.confirmed", entity_type: "placements", entity_id: placements[0].id, actor_id: adminUserId },
  ];
}

export function enrichCandidates() {
  return [
    { ...candidates[0], job_order_id: JO.hk, agent_id: recruitmentAgents[0].id },
    { ...candidates[1], job_order_id: JO.hk, agent_id: recruitmentAgents[1].id },
    { ...candidates[2], job_order_id: JO.crane },
    { ...candidates[3], job_order_id: JO.security },
    { ...candidates[4], job_order_id: JO.security, status: "offered" },
    { ...candidates[5], job_order_id: JO.baggage },
  ];
}

export const EXTENDED_SEED_ORDER = [
  ["client_contacts", () => clientContacts],
  ["recruitment_agents", () => recruitmentAgents],
  ["accommodations", () => accommodations],
  ["accommodation_rooms", () => accommodationRooms],
  ["vehicles", () => vehicles],
  ["drivers", () => drivers],
  ["inventory_items", () => inventoryItems],
];

export function buildExtendedRows(adminUserId, staffIds) {
  return [
    ["candidates", enrichCandidates],
    ["bed_assignments", buildBedAssignments],
    ["documents", () => buildDocuments(adminUserId)],
    ["candidate_documents", () => buildCandidateDocuments(adminUserId)],
    ["medical_records", () => buildMedicalRecords(adminUserId)],
    ["visa_records", () => buildVisaRecords(adminUserId)],
    ["warning_letters", () => buildWarningLetters(adminUserId)],
    ["pro_tasks", () => buildProTasks(adminUserId, staffIds)],
    ["internal_tasks", () => buildInternalTasks(adminUserId, staffIds)],
    ["asset_issuances", () => buildAssetIssuances(adminUserId)],
    ["inventory_transactions", () => buildInventoryTransactions(adminUserId)],
    ["transport_routes", buildTransportRoutes],
    ["incidents", () => buildIncidents(adminUserId)],
    ["communication_logs", () => buildCommunicationLogs(adminUserId)],
    ["contract_documents", () => buildContractDocuments(adminUserId)],
    ["airport_pickups", () => buildAirportPickups(adminUserId)],
    ["payments", () => buildPayments(adminUserId)],
    ["issue_comments", () => buildIssueComments(adminUserId)],
    ["audit_log", () => buildAuditLog(adminUserId)],
  ];
}
