import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

const PLANS: Record<string, { name: string; description: string; interval: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring.Interval; intervalCount: number }> = {
  monthly: {
    name: "TrustNet.Ai Standard",
    description: "Monthly subscription - Unlimited Image Scans, Voice Scam Detection, WhatsApp Bot Access, Email Support",
    interval: "month",
    intervalCount: 1,
  },
  "semi-annual": {
    name: "TrustNet.Ai Semi-Annual",
    description: "6-month subscription - All Standard Features + Video Deepfake Analysis, Priority Threat Alerts, Personal Safety Dashboard",
    interval: "month",
    intervalCount: 6,
  },
  yearly: {
    name: "TrustNet.Ai Premium",
    description: "Annual subscription - All Semi-Annual Features + 24/7 Helpline Access, Family Protection (5 Users), Direct Cyber Cell Referral",
    interval: "year",
    intervalCount: 1,
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, price, email } = body;

    if (!plan || !price || !email) {
      return NextResponse.json(
        { error: "Missing required fields: plan, price, email" },
        { status: 400 }
      );
    }

    const planConfig = PLANS[plan];
    if (!planConfig) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: planConfig.name,
              description: planConfig.description,
            },
            unit_amount: price * 100,
            recurring: {
              interval: planConfig.interval,
              interval_count: planConfig.intervalCount,
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/index.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/index.html?payment=cancelled`,
      metadata: {
        plan,
        price: price.toString(),
        email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
