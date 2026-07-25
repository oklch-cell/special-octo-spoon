import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from "@/models/user.model";
import type { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is undefined!");
}

export function getJwt(id: string, response: NextResponse) {
    const token = jwt.sign({ id }, JWT_SECRET!, { expiresIn: "7d" });
    response.cookies.set("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
    });
}

export async function verifyJwtToken(request: NextRequest) {
    try {
        const token = request.cookies.get("token");
        if (!token) {
            return { error: "NULL_TOKEN", user: null, admin: false };
        }

        const { id } = jwt.verify(token.value as unknown as string, JWT_SECRET!) as JwtPayload;
        if (!id || !Types.ObjectId.isValid(id)) {
            return { error: "Invalid token!", user: null, admin: false };
        }

        const user = await User.findById(id).select("-password");
        if (!user) {
            return { error: "Invalid token!", user: null, admin: false };
        }

        if (user.role && user.role === "ADMIN") {
            return { error: null, user, admin: true };
        }

        return { error: null, user, admin: false };
    } catch (e) {
        if (e instanceof Error) {
            console.error("[ERROR]:", e.message);
            return { error: e.message, user: null, admin: false };
        }
        return { error: "Unknown error!", user: null, admin: false };
    }
}
