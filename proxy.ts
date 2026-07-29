import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/helper";

export default async function proxy(request: NextRequest) {
  try {
    const { admin, error, user } = await verifyJwtToken(request);
    console.log("USER (PROXY):", user);

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
