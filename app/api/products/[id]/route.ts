import { connect } from "@/lib/database";
import { NextResponse, NextRequest } from "next/server";
import { Product } from "@/models/product.model";
import { Types } from "mongoose";
import { verifyJwtToken } from "@/lib/helper";

export async function GET(_: NextRequest, context: { params: Promise<{id: string}> }) {
    try {
        await connect();

        const { id } = await context.params;
        if (!id || !Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                error: "Invalid product id!",
                data: null
            }, { status: 400 });
        }

        const product = await Product.findById(id);

        return NextResponse.json({
            success: true,
            data: { product },
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

export async function PUT(request: NextRequest, context: { params: Promise<{id: string}> }) {
    try {
        await connect();

        const { name, price, quantity, description, images, category } = await request.json();
        const { id } = await context.params;
        const { admin, error } = await verifyJwtToken(request);

        if (!id || !Types.ObjectId.isValid(id)) {
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

        if (!admin) {
            return NextResponse.json({
                success: false,
                data: null,
                error: "Admin access only!",
            }, { status: 403 });
        }

        const product = await Product.findByIdAndUpdate(id, { name, price, quantity, description, images, category }, { returnDocument: "after" });

        return NextResponse.json({
            success: true,
            data: product,
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

export async function DELETE(request: NextRequest, context: { params: Promise<{id: string}> }) {
    try {
        await connect();

        const { id } = await context.params;
        const { admin, error } = await verifyJwtToken(request);

        if (!id || !Types.ObjectId.isValid(id)) {
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

        if (!admin) {
            return NextResponse.json({
                success: false,
                data: null,
                error: "Admin access only!",
            }, { status: 403 });
        }

        const product = await Product.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            data: product,
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
