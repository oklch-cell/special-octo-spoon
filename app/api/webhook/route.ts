import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { Product } from "@/models/product.model";
import { Order } from "@/models/order.model";

export async function POST(req: Request) {
    const body = await req.text();
    let order;
    const signature = (await headers()).get("stripe-signature")!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        return new Response("Invalid signature", { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        for (const item of lineItems.data) {
            const productId = typeof item.price?.product === 'string' ? item.price.product : item.price?.product?.id;

            if (productId) {
                const product = await stripe.products.retrieve(productId);

                const { product_id, order_id, qty } = product.metadata;
                order = order_id;
                await Product.findByIdAndUpdate(product_id, { $inc: { quantity: -qty } });
            }
        }

        await Order.findByIdAndUpdate(order, { status: "DISPATCHED" });
    }

    return new Response(null, {
        status: 200,
    });
}