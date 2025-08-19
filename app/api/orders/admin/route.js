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

export async function POST(req) {
  try {
    await connectToDB();
    
    // Get current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get start of week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    // Get start of month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Get start of year
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    // Get tomorrow for end date range
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Query for total sales (all time)
    const allOrders = await Order.find();
    const totalSales = allOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Query for today's orders
    const todayOrders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow }
    });
    const todayOrderCount = todayOrders.length;
    const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Query for weekly sales
    const weeklyOrders = await Order.find({
      createdAt: { $gte: startOfWeek, $lt: tomorrow }
    });
    const weeklySales = weeklyOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Query for monthly sales
    const monthlyOrders = await Order.find({
      createdAt: { $gte: startOfMonth, $lt: tomorrow }
    });
    const monthlySales = monthlyOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Query for yearly sales
    const yearlyOrders = await Order.find({
      createdAt: { $gte: startOfYear, $lt: tomorrow }
    });
    const yearlySales = yearlyOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Query for pending orders
    const pendingOrders = await Order.find({ status: "Pending" });
    const pendingOrderCount = pendingOrders.length;
    
    // Sort today's orders by creation time (newest first)
    const sortedTodayOrders = todayOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Return dashboard data
    return Response.json({
      totalSales,
      todayOrderCount,
      todaySales,
      weeklySales,
      monthlySales,
      yearlySales,
      pendingOrderCount,
      recentOrders: sortedTodayOrders.slice(0, 5) // Return 5 most recent orders for today
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return Response.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
