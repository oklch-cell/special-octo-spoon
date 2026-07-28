import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    const { cartItems, orderId } = await req.json();

    const session = await stripe.checkout.sessions.create({
        metadata: {
            orderId,
        },
        payment_method_types: ["card"],
        mode: "payment",
        line_items: cartItems.map((item: any) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.product.name,
                    metadata: {
                        product_id: item.product._id,
                        qty: item.quantity,
                        order_id: orderId,
                    },
                },
                unit_amount: item.product.price * 100,
            },
            quantity: item.quantity,
        })),
        invoice_creation: {
          enabled: true,
        },
        success_url:
            `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:
            `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    return NextResponse.json({
        url: session.url,
    });
}