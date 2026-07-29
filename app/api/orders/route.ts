import { connect } from "@/lib/database";
import { NextResponse, NextRequest } from "next/server";
import { Order } from "@/models/order.model";
import { verifyJwtToken } from "@/lib/helper";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const { user, error } = await verifyJwtToken(request);
    const { price, products, address } = await request.json();

    if (error) {
      if (error === "NULL_TOKEN") {
        return NextResponse.json({}, { status: 200 });
      } else {
        return NextResponse.json(
          {
            success: false,
            error,
            data: null,
          },
          { status: 400 },
        );
      }
    }

    if (!price || !address || !products) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required!",
          data: null,
        },
        { status: 400 },
      );
    }

    const order = await Order.create({
      user: user._id,
      products,
      price,
      address,
    });

    return NextResponse.json(
      {
        success: true,
        data: order,
        error: null,
      },
      { status: 201 },
    );
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

export async function GET(request: NextRequest) {
  try {
    await connect();

    const { user, error, admin } = await verifyJwtToken(request);
    if (error) {
      if (error === "NULL_TOKEN") {
        return NextResponse.json(
          {
            success: true,
            data: null,
            error: null,
          },
          { status: 200 },
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            error,
            data: null,
          },
          { status: 400 },
        );
      }
    }

    if (admin) {
      const orders = await Order.find({}).populate("products");
      return NextResponse.json(
        {
          success: true,
          data: orders,
          error: null,
        },
        { status: 200 },
      );
    }

    const orders = await Order.find({ user: user._id }).populate("products");

    return NextResponse.json(
      {
        success: true,
        data: orders,
        error: null,
      },
      { status: 200 },
    );
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
