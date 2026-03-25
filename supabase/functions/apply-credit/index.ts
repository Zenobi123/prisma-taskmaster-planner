
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

interface ApplyCreditRequest {
  clientId: string
  factureId: string
  paiementId: string
  montant: number
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

    // Parse request
    const { clientId, factureId, paiementId, montant } = await req.json() as ApplyCreditRequest

    // Validate inputs
    if (!clientId || !factureId || !paiementId || !montant) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(clientId) || !uuidRegex.test(factureId) || !uuidRegex.test(paiementId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid ID format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate montant is a positive number
    if (typeof montant !== 'number' || montant <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the payment exists and is a credit
    const { data: payment, error: paymentError } = await supabaseClient
      .from('paiements')
      .select('*')
      .eq('id', paiementId)
      .eq('client_id', clientId)
      .eq('est_credit', true)
      .single()

    if (paymentError || !payment) {
      return new Response(
        JSON.stringify({ error: 'Credit payment not found or not valid' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Verify the invoice exists for this client
    const { data: invoice, error: invoiceError } = await supabaseClient
      .from('factures')
      .select('*')
      .eq('id', factureId)
      .eq('client_id', clientId)
      .single()

    if (invoiceError || !invoice) {
      return new Response(
        JSON.stringify({ error: 'Invoice not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Apply the credit payment to the invoice
    const { error: updateError } = await supabaseClient
      .from('paiements')
      .update({
        facture_id: factureId,
        est_credit: false,
        notes: `Avance appliquée à la facture ${factureId}`
      })
      .eq('id', paiementId)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to apply credit to invoice' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Credit successfully applied to invoice' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
