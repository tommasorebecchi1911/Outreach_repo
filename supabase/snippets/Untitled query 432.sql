UPDATE aziende
SET status_processo = 'pending',
  log_errori = null
WHERE id_azienda = '1';