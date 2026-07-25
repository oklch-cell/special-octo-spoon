import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { User } from "@/models/user.model";
import { connect } from "@/lib/database";
import { verifyJwtToken } from "@/lib/helper";

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

        return NextResponse.json({
            success: true,
            data: user,
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

export async function PUT(request: NextRequest) {
    try {
        await connect();

        const { name, email, password, new_password, address, phone } = await request.json();
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

        if (password) {
            const new_user = await User.findById(user._id);
            const matched = await new_user.compare(password);
            if (!matched) {
                return NextResponse.json({
                    success: false,
                    error: "Passwords not matched!",
                    data: null
                }, { status: 400 });
            }

            const pass_changed = await User.findByIdAndUpdate(user._id, { password: new_password }, { returnDocument: "after" });
            await pass_changed.encrypt();
            await pass_changed.save();

            return NextResponse.json({
                success: true,
                data: pass_changed,
                error: null,
            });
        }

        const new_user = await User.findByIdAndUpdate(user._id, { name, email, address, phone }, { returnDocument: "after" });
        if (!new_user) {
            return NextResponse.json({
                success: false,
                error: "User not found!",
                data: null
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            error: null,
            data: new_user,
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

export async function DELETE(request: NextRequest) {
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

        const deleted_user = await User.findByIdAndDelete(user._id);
        if (!deleted_user) {
            return NextResponse.json({
                success: false,
                error: "User not found!",
                data: null
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            error: null,
            data: deleted_user,
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
