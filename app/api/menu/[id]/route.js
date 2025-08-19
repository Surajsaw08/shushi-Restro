import { connectToDB } from "@/utils/db";
import Menu from "@/models/Menu";

// UPDATE menu item
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const updateData = await req.json();

    await connectToDB();

    const updatedMenuItem = await Menu.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedMenuItem) {
      return Response.json({ error: "Menu item not found" }, { status: 404 });
    }

    return Response.json(updatedMenuItem, { status: 200 });
  } catch (error) {
    console.error("Error updating menu item:", error);
    return Response.json(
      { error: "Failed to update menu item" },
      { status: 500 }
    );
  }
}

// DELETE menu item
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await connectToDB();

    const deletedMenuItem = await Menu.findByIdAndDelete(id);

    if (!deletedMenuItem) {
      return Response.json({ error: "Menu item not found" }, { status: 404 });
    }

    return Response.json({ success: true, id }, { status: 200 });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return Response.json(
      { error: "Failed to delete menu item" },
      { status: 500 }
    );
  }
}
