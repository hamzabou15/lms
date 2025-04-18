// api/webhook/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        // 1. Verify environment variable
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error("STRIPE_WEBHOOK_SECRET is not set");
        }

        // 2. Get raw body and signature
        const body = await req.text();
        const signature = (await headers()).get('stripe-signature');

        if (!signature) {
            throw new Error("Missing stripe-signature header");
        }

        console.log("Webhook received - body length:", body.length);
        console.log("Signature:", signature.substring(0, 20) + "...");

        // 3. Verify event
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
            console.log("Verified event:", event.type);
        } catch (err) {
            console.error("⚠️ Webhook signature verification failed:", err);
            return new NextResponse(`Webhook Error: ${(err as Error).message}`, { status: 400 });
        }

        // 4. Handle checkout.session.completed events
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            console.log("Checkout session completed:", session.id);
            console.log("Payment status:", session.payment_status);

            if (session.payment_status === 'paid') {
                const { courseId, userId } = session.metadata || {};

                if (!courseId || !userId) {
                    console.error("Missing metadata in session");
                    return new NextResponse("Missing metadata", { status: 400 });
                }

                console.log(`Creating purchase for user ${userId}, course ${courseId}`);

                await db.purchase.create({
                    data: { courseId, userId },
                });
            }
        }

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("❌ Webhook handler error:", error);
        return new NextResponse(
            `Webhook Error: ${(error as Error).message}`,
            { status: 400 }
        );
    }
}