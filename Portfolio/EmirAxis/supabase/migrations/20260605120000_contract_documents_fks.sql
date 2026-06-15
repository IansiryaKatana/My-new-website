-- PostgREST embeds (workers:worker_id) require FK relationships on contract_documents.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'contract_documents_worker_id_fkey'
  ) THEN
    ALTER TABLE public.contract_documents
      ADD CONSTRAINT contract_documents_worker_id_fkey
      FOREIGN KEY (worker_id) REFERENCES public.workers(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'contract_documents_client_id_fkey'
  ) THEN
    ALTER TABLE public.contract_documents
      ADD CONSTRAINT contract_documents_client_id_fkey
      FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';
