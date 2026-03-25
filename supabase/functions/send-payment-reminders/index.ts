
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').filter(Boolean)

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('Origin') || ''
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0] || ''
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
}

interface PaymentReminder {
  id: string
  client_id: string
  facture_id: string
  method: 'email' | 'sms' | 'both'
  last_sent: string | null
  send_frequency: number
  is_active: boolean
}

interface Client {
  id: string
  nom: string
  raisonsociale: string
  contact: {
    email: string
    telephone: string
  }
}

interface Facture {
  id: string
  date: string
  echeance: string
  montant: number
  montant_paye: number
  montant_restant: number
  status: string
  status_paiement: string
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Vérifier la présence du token d'authentification
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Create a Supabase client with the service role for backend operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get all active reminders that haven't been sent in their frequency period or never sent
    const { data: reminders, error: remindersError } = await supabaseClient
      .from('payment_reminders')
      .select('*')
      .eq('is_active', true)
      .or(`last_sent.is.null,last_sent.lt.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}`)

    if (remindersError) {
      throw remindersError
    }

    // Process each reminder
    const results = []
    for (const reminder of reminders || []) {
      const result = await processReminder(supabaseClient, reminder)
      results.push(result)
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

async function processReminder(supabase: any, reminder: PaymentReminder) {
  try {
    // Get client info
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', reminder.client_id)
      .single()

    if (clientError) {
      throw clientError
    }

    // Get facture info
    const { data: facture, error: factureError } = await supabase
      .from('factures')
      .select('*')
      .eq('id', reminder.facture_id)
      .single()

    if (factureError) {
      throw factureError
    }

    // Check if invoice is already paid
    if (facture.status_paiement === 'payée') {
      await supabase
        .from('payment_reminders')
        .update({ is_active: false })
        .eq('id', reminder.id)
      return { id: reminder.id, status: 'deactivated', reason: 'invoice_paid' }
    }

    // Send email reminder if needed
    if (reminder.method === 'email' || reminder.method === 'both') {
      await sendEmailReminder(client, facture)
    }

    // Send SMS reminder if needed
    if (reminder.method === 'sms' || reminder.method === 'both') {
      await sendSmsReminder(client, facture)
    }

    // Update the last_sent timestamp
    await supabase
      .from('payment_reminders')
      .update({ last_sent: new Date().toISOString() })
      .eq('id', reminder.id)

    return { id: reminder.id, status: 'sent', method: reminder.method }
  } catch (error) {
    return { id: reminder.id, status: 'error' }
  }
}

async function sendEmailReminder(client: Client, facture: Facture) {
  const clientName = client.nom || client.raisonsociale
  const clientEmail = client.contact?.email

  if (!clientEmail) {
    return false
  }

  // TODO: Intégrer un service d'email (Resend, SendGrid, Mailgun, AWS SES)

  return true
}

async function sendSmsReminder(client: Client, facture: Facture) {
  const clientName = client.nom || client.raisonsociale
  const clientPhone = client.contact?.telephone

  if (!clientPhone) {
    return false
  }

  // TODO: Intégrer un service SMS (Twilio, Vonage, MessageBird)

  return true
}
