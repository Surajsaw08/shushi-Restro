import { connectToDB } from "@/utils/db";
import Menu from "@/models/Menu";

export async function GET(req) {
  try {
    await connectToDB();

    const menuItems = await Menu.find().sort({ createdAt: -1 }); // Sort by latest items

    return Response.json(menuItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return Response.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const menuData = await req.json();
    
    // Validate required fields
    if (!menuData.name || !menuData.category || !menuData.price) {
      return Response.json(
        { error: "Name, category, and price are required" },
        { status: 400 }
      );
    }

    await connectToDB();
    
    const newMenuItem = new Menu({
      name: menuData.name,
      category: menuData.category,
      price: parseFloat(menuData.price),
      status: menuData.status || "Available",
      imageUrl: menuData.imageUrl || "",
    });

    await newMenuItem.save();
    
    return Response.json(newMenuItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return Response.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}