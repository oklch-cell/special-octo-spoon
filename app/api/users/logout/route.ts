import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json(
    {
      success: true,
      data: "Logged out successfully!",
      error: null,
    },
    { status: 200 },
  );

  response.cookies.set("token", "");
  return response;
}
