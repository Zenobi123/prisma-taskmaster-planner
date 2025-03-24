
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    console.log('Checking for payment reminders to send...')

    // Get all active reminders that haven't been sent in their frequency period or never sent
    const { data: reminders, error: remindersError } = await supabaseClient
      .from('payment_reminders')
      .select('*')
      .eq('is_active', true)
      .or(`last_sent.is.null,last_sent.lt.${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}`)

    if (remindersError) {
      console.error('Error fetching reminders:', remindersError)
      throw remindersError
    }

    console.log(`Found ${reminders?.length || 0} reminders to process`)

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
    console.error('Error processing payment reminders:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

async function processReminder(supabase: any, reminder: PaymentReminder) {
  console.log(`Processing reminder for facture ${reminder.facture_id}`)
  
  try {
    // Get client info
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', reminder.client_id)
      .single()

    if (clientError) {
      console.error(`Error fetching client ${reminder.client_id}:`, clientError)
      throw clientError
    }

    // Get facture info
    const { data: facture, error: factureError } = await supabase
      .from('factures')
      .select('*')
      .eq('id', reminder.facture_id)
      .single()

    if (factureError) {
      console.error(`Error fetching facture ${reminder.facture_id}:`, factureError)
      throw factureError
    }

    // Check if invoice is already paid
    if (facture.status_paiement === 'payée') {
      console.log(`Facture ${facture.id} is already paid, deactivating reminder`)
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
    console.error(`Error processing reminder ${reminder.id}:`, error)
    return { id: reminder.id, status: 'error', error: error.message }
  }
}

async function sendEmailReminder(client: Client, facture: Facture) {
  console.log(`Sending email reminder to ${client.nom} for facture ${facture.id}`)
  
  // In a real implementation, you would use an email service API here
  // This is a placeholder for the actual email sending logic
  
  const clientName = client.nom || client.raisonsociale
  const clientEmail = client.contact?.email
  
  if (!clientEmail) {
    console.warn(`No email address available for client ${client.id}`)
    return false
  }
  
  console.log(`Would send email to ${clientEmail} for ${facture.id} with amount ${facture.montant_restant}`)
  
  // To actually send emails, you would integrate with a service like:
  // - Resend
  // - SendGrid
  // - Mailgun
  // - AWS SES
  
  return true
}

async function sendSmsReminder(client: Client, facture: Facture) {
  console.log(`Sending SMS reminder to ${client.nom} for facture ${facture.id}`)
  
  // In a real implementation, you would use an SMS API service here
  // This is a placeholder for the actual SMS sending logic
  
  const clientName = client.nom || client.raisonsociale
  const clientPhone = client.contact?.telephone
  
  if (!clientPhone) {
    console.warn(`No phone number available for client ${client.id}`)
    return false
  }
  
  console.log(`Would send SMS to ${clientPhone} for ${facture.id} with amount ${facture.montant_restant}`)
  
  // To actually send SMS, you would integrate with a service like:
  // - Twilio
  // - Vonage/Nexmo
  // - MessageBird
  
  return true
}
