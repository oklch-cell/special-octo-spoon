import { connect } from "@/lib/database";
import { NextResponse, NextRequest } from "next/server";
import { User } from "@/models";
import { getJwt } from "@/lib/helper";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required!",
          data: null,
        },
        { status: 400 },
      );
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already exists!",
          data: null,
        },
        { status: 400 },
      );
    }

    const user = await User.create({ name, email, password });
    await user.encrypt();
    await user.save();

    const response = NextResponse.json(
      {
        success: true,
        data: user,
        error: null,
      },
      { status: 201 },
    );

    getJwt(user._id, response);

    return response;
  } catch (e) {
    if (e instanceof Error) {
      console.error("[ERROR]:", e.message);
      return NextResponse.json(
        {
          success: false,
          error: e.message,
          data: null,
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Unknown error!",
        data: null,
      },
      { status: 500 },
    );
  }
}
