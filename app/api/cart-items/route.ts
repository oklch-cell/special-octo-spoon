import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwtToken } from "@/lib/helper";
import { connect } from "@/lib/database";
import { CartItem } from "@/models/cart-item.model";

export async function POST(request: NextRequest) {
    try {
        await connect();
        const { product, quantity } = await request.json();
        const { user, error } = await verifyJwtToken(request);

        if (!product || !quantity) {
            return NextResponse.json({
                success: false,
                error: "All fields are required!",
                data: null
            }, { status: 400 });
        }

        if (error) {
            if (error === "NULL_TOKEN") {
                return NextResponse.json({}, { status: 200 });
            } else {
                return NextResponse.json({
                    success: false,
                    error,
                    data: null
                }, { status: 400 });
            }
        }

        const exists = await CartItem.findOne({ product, user: user._id });
        if (exists) {
            await CartItem.findOneAndUpdate({ product, user: user._id }, { $inc: { quantity: 1 } });
            return NextResponse.json({
                success: true,
                data: {},
                error: null,
            }, { status: 200 });
        }

        const cart_item = await CartItem.create({ product, quantity, user: user._id });

        return NextResponse.json({
            success: true,
            data: cart_item,
            error: null,
        }, { status: 201 });
    } catch (e) {
        if (e instanceof Error) {
            console.error("[ERROR]:", e.message);
            return NextResponse.json({
                success: false,
                error: e.message,
                data: null
            }, { status: 500 });
        }
        return NextResponse.json({
            success: false,
            error: "Unknown error!",
            data: null
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        await connect();
        const { user, error } = await verifyJwtToken(request);

        if (error) {
            if (error === "NULL_TOKEN") {
                return NextResponse.json({}, { status: 200 });
            } else {
                return NextResponse.json({
                    success: false,
                    error,
                    data: null
                }, { status: 400 });
            }
        }

        const cart_items = await CartItem.find({ user: user._id }).populate("product");

        return NextResponse.json({
            success: true,
            error: null,
            data: cart_items,
        }, { status: 200 });
    } catch (e) {
        if (e instanceof Error) {
            console.error("[ERROR]:", e.message);
            return NextResponse.json({
                success: false,
                error: e.message,
                data: null
            }, { status: 500 });
        }
        return NextResponse.json({
            success: false,
            error: "Unknown error!",
            data: null
        }, { status: 500 });
    }
}
