import { z } from 'zod'

const statusProcessoSchema = z.union([
  z.literal('pending'),
  z.literal('processing'),
  z.literal('completed'),
  z.literal('error'),
])
export type ProcessStatus = z.infer<typeof statusProcessoSchema>

const aziendaSchema = z.object({
  id_azienda: z.number(),
  user_id: z.string().uuid(),
  partita_iva: z.string(),
  nome_azienda: z.string(),
  indirizzo: z.string().nullable(),
  comune: z.string().nullable(),
  cap: z.string().nullable(),
  provincia: z.string().nullable(),
  regione: z.string().nullable(),
  status_processo: statusProcessoSchema.nullable(),
  search_query_generated: z.string().nullable(),
  website_url: z.string().nullable(),
  dati_contatto_raw: z.unknown().nullable(),
  email_target: z.string().nullable(),
  email_generata_oggetto: z.string().nullable(),
  email_generata_corpo: z.string().nullable(),
  log_errori: z.string().nullable(),
  last_processed_at: z.string().nullable(),
  email_inviata: z.boolean().default(false),
})
export type Azienda = z.infer<typeof aziendaSchema>

export const aziendaListSchema = z.array(aziendaSchema)
