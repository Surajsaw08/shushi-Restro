// app/api/userOrders/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/utils/db";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const orders = await Order.find({ "billingInfo.email": email }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
