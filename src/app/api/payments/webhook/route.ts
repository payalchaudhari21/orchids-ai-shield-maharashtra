import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      event = JSON.parse(body) as Stripe.Event;
      console.warn("STRIPE_WEBHOOK_SECRET not set - skipping signature verification");
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  console.log(`Received webhook event: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("=== Payment Successful ===");
      console.log(`Session ID: ${session.id}`);
      console.log(`Customer Email: ${session.customer_email}`);
      console.log(`Plan: ${session.metadata?.plan}`);
      console.log(`Price: ₹${session.metadata?.price}`);
      console.log(`Amount Total: ₹${(session.amount_total || 0) / 100}`);
      console.log(`Payment Status: ${session.payment_status}`);
      console.log(`Subscription ID: ${session.subscription}`);
      console.log("=========================");
      break;
    }

    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("=== Subscription Created ===");
      console.log(`Subscription ID: ${subscription.id}`);
      console.log(`Customer ID: ${subscription.customer}`);
      console.log(`Status: ${subscription.status}`);
      console.log("============================");
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("=== Subscription Updated ===");
      console.log(`Subscription ID: ${subscription.id}`);
      console.log(`New Status: ${subscription.status}`);
      console.log("============================");
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("=== Subscription Cancelled ===");
      console.log(`Subscription ID: ${subscription.id}`);
      console.log(`Customer ID: ${subscription.customer}`);
      console.log("==============================");
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("=== Invoice Payment Succeeded ===");
      console.log(`Invoice ID: ${invoice.id}`);
      console.log(`Customer Email: ${invoice.customer_email}`);
      console.log(`Amount Paid: ₹${(invoice.amount_paid || 0) / 100}`);
      console.log("=================================");
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("=== Invoice Payment Failed ===");
      console.log(`Invoice ID: ${invoice.id}`);
      console.log(`Customer Email: ${invoice.customer_email}`);
      console.log(`Amount Due: ₹${(invoice.amount_due || 0) / 100}`);
      console.log("==============================");
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
