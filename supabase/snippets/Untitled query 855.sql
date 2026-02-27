create table public.aziende (
  id_azienda bigint generated always as identity not null,
  user_id uuid not null,
  partita_iva text not null,
  nome_azienda text not null,
  indirizzo text null,
  comune text null,
  cap text null,
  provincia text null,
  regione text null,
  status_processo text null default 'pending'::text,
  google_search_query text null,
  website_url text null,
  dati_contatto_raw jsonb null,
  email_target text null,
  email_generata_oggetto text null,
  email_generata_corpo text null,
  log_errori text null,
  last_processed_at timestamp with time zone null,
  email_inviata boolean null default false,
  website_from_excel text null,
  descrizione_attivita text null,
  rna_data jsonb null,
  has_subsidy_2024 boolean null,
  contact_page_url text null,
  info_utili text null,
  constraint aziende_pkey primary key (id_azienda),
  constraint aziende_user_id_partita_iva_key unique (user_id, partita_iva),
  constraint aziende_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint aziende_status_processo_check check (
    (
      status_processo = any (
        array[
          'pending'::text,
          'processing'::text,
          'completed'::text,
          'error'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_piva_global on public.aziende using btree (partita_iva) TABLESPACE pg_default;

create index IF not exists idx_queue_status on public.aziende using btree (status_processo) TABLESPACE pg_default;

create trigger aziende_enqueue_process_batch_after_insert
after INSERT on aziende REFERENCING NEW table as new_rows for EACH STATEMENT
execute FUNCTION enqueue_process_batch_on_pending_rows ();

create trigger aziende_enqueue_process_batch_after_update
after
update on aziende REFERENCING NEW table as new_rows for EACH STATEMENT
execute FUNCTION enqueue_process_batch_on_pending_rows ();