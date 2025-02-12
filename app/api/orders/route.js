import { connectToDB } from "@/utils/db";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    const { billingInfo, cart, total } = await req.json();

    console.log("Received order data:", { billingInfo, cart, total });
    if (
      !billingInfo ||
      !billingInfo.firstName ||
      !billingInfo.lastName ||
      !billingInfo.email ||
      !billingInfo.phone
    ) {
      console.error("Invalid billing info!");
      return Response.json(
        { error: "Billing details are required!" },
        { status: 400 }
      );
    }

    if ( !cart || cart.length === 0 || total === 0) {
      console.error("Invalid order data");
      return Response.json(
        { error: "Invalid order data" },
        { status: 400 }
      );
    }

    await connectToDB(); // ✅ Connect to MongoDB

    const newOrder = new Order({
      billingInfo,
      cart,
      total,
      status: "Pending",
      createdAt: new Date(),
    });

    await newOrder.save();
    console.log("Order saved successfully!");

    return Response.json({ message: "Order placed successfully!" }, { status: 201 });

  } catch (error) {
    console.error("Error in API:", error);
    return Response.json(
      { error: "Failed to place order", details: error.message },
      { status: 500 }
    );
  }
}
