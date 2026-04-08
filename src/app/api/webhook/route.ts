import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Use service role for webhook (bypasses RLS)
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = getServiceClient();

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      if (userId) {
        await supabase.from('profiles').update({ plan: 'pro' }).eq('id', userId);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId);
      if (profiles && profiles.length > 0) {
        await supabase.from('profiles').update({ plan: 'free' }).eq('stripe_customer_id', customerId);
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
