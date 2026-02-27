update public.aziende
set
  status_processo = 'pending',
  log_errori = null,
  last_processed_at = null,
  email_target = null,
  contact_page_url = null,
  dati_contatto_raw = null