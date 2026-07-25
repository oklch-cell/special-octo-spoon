import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connect } from "@/lib/database";
import { Order } from "@/models/order.model";
import { verifyJwtToken } from "@/lib/helper";
import { Types } from "mongoose";
import { Product } from "@/models/product.model";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { user, error } = await verifyJwtToken(request);
        const { price, quantity, address, productId } = await request.json();

        if (!price || !quantity || !address || !productId) {
            return NextResponse.json({
                success: false,
                error: "All fields are required!",
                data: null
            }, { status: 400 });
        }

        if (!Types.ObjectId.isValid(productId)) {
            return NextResponse.json({
                success: false,
                error: "Invalid product id!",
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

        const product = await Product.findById(productId);

        if (!product || product.quantity === 0) {
            return NextResponse.json({
                success: false,
                data: null,
                error: "Stock is not available!",
            });
        }

        const order = await Order.create({ user: user._id, product: productId, price, quantity, address });
        await Product.findByIdAndUpdate(productId, { $inc: { quantity: -quantity } });

        return NextResponse.json({
            success: true,
            data: order,
            error: null,
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

        const orders = await Order.find({ user: user._id });

        return NextResponse.json({
            success: true,
            data: orders,
            error: null,
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
