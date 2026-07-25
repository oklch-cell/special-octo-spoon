import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { connect } from "@/lib/database";
import { CartItem } from "@/models/cart-item.model";
import { Types } from "mongoose";
import { verifyJwtToken } from "@/lib/helper";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        await connect();
        const { id } = await context.params;
        const { user, error } = await verifyJwtToken(request);
        const { qty } = await request.json();

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

        if (!id || !Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                data: null,
                error: "Invalid parameter!",
            }, { status: 400 });
        }

        if (!qty) {
            return NextResponse.json({
                success: false,
                data: null,
                error: "Quantity is required!",
            }, { status: 200 });
        }

        const cartItem = await CartItem.findOneAndUpdate({ _id: id, user: user._id }, { $inc: { quantity: qty } }, { returnDocument: "after" });
        if (cartItem.quantity === 0) {
            await CartItem.findByIdAndDelete(id);
        }

        return NextResponse.json({
            success: true,
            data: cartItem,
            error: null,
        });
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
