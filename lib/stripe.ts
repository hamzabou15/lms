import Stripe from "stripe";


// STRIPE_API_KEY
export const stripe = new Stripe(process?.env?.STRIPE_API_KEY || "", {
    apiVersion: "2025-03-31.basil",
    typescript: true

})