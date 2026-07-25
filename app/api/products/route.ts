import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Product } from "@/models/product.model";
import { verifyJwtToken } from "@/lib/helper";
import { connect } from "@/lib/database";

export async function GET() {
    try {
        await connect();

        const products = await Product.find({});

        return NextResponse.json({
            success: true,
            data: products,
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

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { admin, error } = await verifyJwtToken(request);
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

        const { name, description, price, quantity, category, images } = await request.json();
        if (!name || !description || !price || !quantity || !category || !images.length) {
            return NextResponse.json({
                success: false,
                data: null,
                error: "All fields are required!",
            }, { status: 400 });
        }

        const product = await Product.create({ name, description, price, quantity, category, images });

        return NextResponse.json({
            success: true,
            data: product,
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
