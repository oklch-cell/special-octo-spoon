import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/helper";

export default async function proxy(request: NextRequest) {
    try {
        const { admin, error } = await verifyJwtToken(request);

        if (error || !admin) {
            return NextResponse.redirect("/");
        }
    } catch (error) {
        console.error("[ERROR]:", error);
    }
}

export const config = {
    matcher: [
        "/admin/:path*",
    ]
}
