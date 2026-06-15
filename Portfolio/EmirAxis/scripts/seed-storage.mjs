/**
 * Upload minimal placeholder PDFs for seed document rows (service role).
 */
import { buildCandidateDocuments, buildDocuments } from "./seed-data-modules.mjs";

/** Minimal valid PDF (single empty page). */
const MINIMAL_PDF = Buffer.from(
  `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 200 200]/Parent 2 0 R>>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer<</Size 4/Root 1 0 R>>
startxref
190
%%EOF`,
  "utf8",
);

async function uploadPdf(supabase, bucket, path) {
  const { error } = await supabase.storage.from(bucket).upload(path, MINIMAL_PDF, {
    contentType: "application/pdf",
    upsert: true,
  });
  if (error) throw new Error(`${bucket}/${path}: ${error.message}`);
}

export async function seedDocumentStorage(supabase, adminUserId) {
  let uploaded = 0;
  for (const row of buildDocuments(adminUserId)) {
    if (!row.file_path) continue;
    await uploadPdf(supabase, "documents", row.file_path);
    uploaded += 1;
  }
  for (const row of buildCandidateDocuments(adminUserId)) {
    if (!row.file_path) continue;
    await uploadPdf(supabase, "candidate-documents", row.file_path);
    uploaded += 1;
  }
  console.log(`  storage: ${uploaded} placeholder PDF(s) (documents + candidate-documents)`);
}
