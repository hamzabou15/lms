import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text(); // must be text, not json
    const sig = (await headers()).get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("[WEBHOOK_ERROR]", err);
        return new NextResponse("Webhook Error", { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const courseId = session?.metadata?.courseId;
        const userId = session?.metadata?.userId;

        if (!courseId || !userId) {
            return new NextResponse("Missing metadata", { status: 400 });
        }

        await db.purchase.create({
            data: {
                courseId,
                userId,
            },
        });
    }

    return new NextResponse(null, { status: 200 });
}
