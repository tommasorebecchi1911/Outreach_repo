import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  // FIX 1: CORS headers aggiunti al preflight
  if (req.method === 'OPTIONS') return new Response('ok', {
    headers: corsHeaders
  });
  try {
    const { id_azienda } = await req.json();
    if (!id_azienda) throw new Error("id_azienda mancante nel body");
    // Setup Client Utente (per verificare permessi tramite RLS)
    const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_ANON_KEY'), {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')
        }
      }
    });
    // 1. Recupera Dati Azienda e Utente in parallelo
    const [{ data: azienda, error: aziendaError }, { data: { user }, error: userError }] = await Promise.all([
      supabase.from('aziende').select('*').eq('id_azienda', id_azienda).single(),
      supabase.auth.getUser()
    ]);
    if (aziendaError || !azienda) throw new Error("Azienda non trovata o accesso negato");
    if (userError || !user) throw new Error("Utente non autenticato");
    // FIX 2: Guard — impedisce reinvio se email già inviata
    if (azienda.email_inviata === true) {
      throw new Error("Email già inviata per questa azienda");
    }
    // FIX 3: Guard — impedisce invio se il processo AI non è completato
    if (azienda.status_processo !== 'completed') {
      throw new Error(`Impossibile inviare: stato processo è '${azienda.status_processo}', attendi 'completed'`);
    }
    // 2. Logica Test vs Produzione
    const isTestMode = true; // Impostare false in produzione
    const recipient = isTestMode ? user.email : azienda.email_target;
    if (!recipient) throw new Error("Nessuna email destinatario trovata");
    if (!azienda.email_generata_oggetto) throw new Error("Oggetto email mancante: processo AI non completato correttamente");
    if (!azienda.email_generata_corpo) throw new Error("Corpo email mancante: processo AI non completato correttamente");
    // 3. Chiamata Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Abifin <onboarding@resend.dev>',
        to: [
          recipient
        ],
        subject: azienda.email_generata_oggetto,
        html: azienda.email_generata_corpo
      })
    });
    const resendData = await res.json();
    if (!res.ok) throw new Error(`Resend error: ${resendData.message || JSON.stringify(resendData)}`);
    // FIX 4: Aggiornamento DB con timestamp
    const { error: updateError } = await supabase.from('aziende').update({
      email_inviata: true,
      last_processed_at: new Date().toISOString()
    }).eq('id_azienda', id_azienda);
    if (updateError) throw new Error(`Email inviata ma errore aggiornamento DB: ${updateError.message}`);
    // FIX 1: CORS headers aggiunti alla risposta di successo
    return new Response(JSON.stringify({
      success: true,
      resend_id: resendData.id
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // FIX 1: CORS headers aggiunti alla risposta di errore
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
