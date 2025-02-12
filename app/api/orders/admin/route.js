import { connectToDB } from "@/utils/db";
import Order from "@/models/Order";

export async function GET(req) {
  try {
    await connectToDB();

    const orders = await Order.find().sort({ createdAt: -1 }); // Sort by latest orders

    return Response.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
