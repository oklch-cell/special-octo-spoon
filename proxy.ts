import { connect } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/helper";

export default async function proxy(request: NextRequest) {
  try {
    await connect();
    const { admin, error } = await verifyJwtToken(request);

    if (!admin && request.url.includes("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (error === "NULL_TOKEN") {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[ERROR]:", error);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/cart", "/orders", "/user"],
};
