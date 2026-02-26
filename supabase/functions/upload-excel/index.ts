import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// FIX: Usiamo esm.sh che è molto più stabile per Supabase rispetto al CDN proprietario
import * as XLSX from "https://esm.sh/xlsx@0.18.5";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  // Gestione preflight CORS (browser check)
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      throw new Error('Nessun file caricato');
    }
    // 1. Setup Supabase Client
    // Crea il client usando il token dell'utente che ha fatto la chiamata
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')
        }
      }
    });
    // Verifica identità utente
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) throw new Error('Utente non autenticato');
    // 2. Parsing Excel
    const arrayBuffer = await file.arrayBuffer();
    // Utilizziamo Uint8Array per compatibilità Deno/XLSX
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
      type: 'array'
    });
    const sheetName = workbook.SheetNames[0];
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    console.log(`Trovate ${jsonData.length} righe nel file Excel`);
    // 3. Mappatura Dati
    // Modifica qui le chiavi stringa (es. 'Ragione Sociale') se il tuo Excel ha nomi diversi
    const recordsToInsert = jsonData.map((row)=>({
        user_id: user.id,
        partita_iva: row['Partita IVA'] || row['piva'] || row['PIVA'] || row['partita_iva'],
        nome_azienda: row['Ragione Sociale'] || row['Nome Azienda'] || row['azienda'] || row['nome'],
        indirizzo: row['Indirizzo'] || row['indirizzo'],
        comune: row['Comune'] || row['comune'],
        provincia: row['Provincia'] || row['provincia'],
        regione: row['Regione'] || row['regione'],
        cap: row['CAP'] || row['cap'],
        status_processo: 'pending' // Stato iniziale per la coda AI
      })).filter((r)=>r.partita_iva && r.nome_azienda); // Scarta righe senza dati essenziali
    if (recordsToInsert.length === 0) {
      throw new Error('Nessuna riga valida trovata o nomi colonne non corrispondenti');
    }
    // 4. Bulk Insert
    // onConflict: ignora i duplicati se l'utente ha già caricato quella P.IVA
    const { error } = await supabaseClient.from('aziende').upsert(recordsToInsert, {
      onConflict: 'user_id, partita_iva',
      ignoreDuplicates: true
    });
    if (error) {
      console.error("Errore DB:", error);
      throw error;
    }
    return new Response(JSON.stringify({
      success: true,
      count: recordsToInsert.length
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Errore Function:", error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
