
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApplyCreditRequest {
  clientId: string
  factureId: string
  paiementId: string
  montant: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request
    const { clientId, factureId, paiementId, montant } = await req.json() as ApplyCreditRequest

    // Validate inputs
    if (!clientId || !factureId || !paiementId || !montant) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

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

    console.log(`Applying credit payment ${paiementId} to invoice ${factureId}`)

    // Verify the payment exists and is a credit
    const { data: payment, error: paymentError } = await supabaseClient
      .from('paiements')
      .select('*')
      .eq('id', paiementId)
      .eq('client_id', clientId)
      .eq('est_credit', true)
      .single()

    if (paymentError || !payment) {
      console.error('Error fetching payment or payment not found:', paymentError)
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
      console.error('Error fetching invoice or invoice not found:', invoiceError)
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
      console.error('Error applying credit to invoice:', updateError)
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
    console.error('Error in apply-credit function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
