import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const RESEND_FROM_EMAIL = Deno.env.get('RESEND_FROM_EMAIL') ?? 'Abifin <onboarding@resend.dev>';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

type SendEmailRequest = {
  id_azienda?: number;
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders
  });
}

serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  if (req.method !== 'POST') {
    return jsonResponse({
      error: 'Method not allowed'
    }, 405);
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    }
    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY');
    }

    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      return jsonResponse({
        error: 'Missing Authorization header'
      }, 401);
    }

    const body = await req.json() as SendEmailRequest;
    const idAzienda = body.id_azienda;
    if (!idAzienda || !Number.isFinite(idAzienda)) {
      return jsonResponse({
        error: 'Invalid id_azienda'
      }, 400);
    }

    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: authorization
        }
      }
    });

    const { data: authData, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !authData.user) {
      return jsonResponse({
        error: 'Unauthorized'
      }, 401);
    }

    const { data: azienda, error: aziendaError } = await supabaseClient.from('aziende').select('id_azienda, nome_azienda, email_target, email_generata_oggetto, email_generata_corpo, email_inviata, status_processo').eq('id_azienda', idAzienda).single();

    if (aziendaError || !azienda) {
      return jsonResponse({
        error: 'Company not found or not accessible'
      }, 404);
    }

    if (azienda.status_processo !== 'completed') {
      return jsonResponse({
        error: `Cannot send email when status is '${azienda.status_processo}'`
      }, 400);
    }

    if (azienda.email_inviata) {
      return jsonResponse({
        error: 'Email already sent for this company'
      }, 400);
    }

    if (!azienda.email_target || !azienda.email_target.trim()) {
      return jsonResponse({
        error: 'No recipient email found for this company'
      }, 400);
    }

    if (!azienda.email_generata_oggetto || !azienda.email_generata_corpo) {
      return jsonResponse({
        error: 'Generated email content is missing'
      }, 400);
    }

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: [
          azienda.email_target
        ],
        subject: azienda.email_generata_oggetto,
        html: azienda.email_generata_corpo
      })
    });

    const resendPayload = await resendResponse.json();
    if (!resendResponse.ok) {
      const details = typeof resendPayload?.message === 'string' ? resendPayload.message : JSON.stringify(resendPayload);
      throw new Error(`Resend error (${resendResponse.status}): ${details}`);
    }

    const { error: updateError } = await supabaseClient.from('aziende').update({
      email_inviata: true,
      last_processed_at: new Date().toISOString(),
      log_errori: null
    }).eq('id_azienda', idAzienda);

    if (updateError) {
      throw new Error(`Email sent but failed to update DB: ${updateError.message}`);
    }

    return jsonResponse({
      success: true,
      resend_id: resendPayload?.id ?? null,
      to: azienda.email_target,
      company: azienda.nome_azienda
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('send-email error:', message);
    return jsonResponse({
      error: message
    }, 500);
  }
});
