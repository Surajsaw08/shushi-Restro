import { connectToDB } from "@/utils/db";
import Order from "@/models/Order";

export async function PUT(req) {
  try {
    const { orderId, status } = await req.json();

    await connectToDB();

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return Response.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
