import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { User } from "@/models/user.model";
import { connect } from "@/lib/database";
import { getJwt } from "@/lib/helper";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                error: "All fields are required!",
                data: null
            }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({
                success: false,
                error: "Invalid login credentials!",
                data: null
            }, { status: 400 });
        }

        const matched = await user.compare(password);
        if (!matched) {
            return NextResponse.json({
                success: false,
                error: "Invalid login credentials!",
                data: null
            }, { status: 400 });
        }

        const response = NextResponse.json({
            success: true,
            data: user,
            error: null,
        }, { status: 200 });

        getJwt(user._id, response);

        return response;
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
