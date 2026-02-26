UPDATE aziende
SET status_processo = 'pending',
  log_errori = null
WHERE status_processo IN ('error', 'processing');