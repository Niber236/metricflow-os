import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialisation stricte de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia", // Utilise la dernière version stable
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    // Vérification cryptographique que la requête vient bien de Stripe
    event = stripe.webhooks.constructEvent(payload, sig!, endpointSecret);
  } catch (err: any) {
    console.error(`❌ Erreur Webhook : ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Si le paiement est validé avec succès
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;

    // C'est ici que la magie opère. Le client a payé.
    // Pour l'instant on log l'information, mais dans la V2, c'est ici 
    // qu'on modifie la base de données Supabase pour débloquer l'agence.
    console.log(`💰 Paiement reçu avec succès pour : ${customerEmail}`);
  }

  return NextResponse.json({ received: true });
}