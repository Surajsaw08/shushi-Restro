import { connectToDB } from "@/utils/db";
import Coupon from "@/models/Coupon";

//update coupon
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const updateCoupon = await req.json();
    await connectToDB();

    if (
      !updateCoupon.code ||
      !updateCoupon.discountType ||
      !updateCoupon.discountValue ||
      !updateCoupon.expiryDate
    ) {
      return Response.json(
        {
          error:
            "Code, discount type, discount value, and expiry date are required",
        },
        { status: 400 }
      );
    }
    if (updateCoupon.discountType === "percentage") {
      if (updateCoupon.discountValue <= 0 || updateCoupon.discountValue > 100) {
        return Response.json(
          { error: "Discount value must be between 0 and 100" },
          { status: 400 }
        );
      }
    }

    if (updateCoupon.discountType === "fixed") {
      if (updateCoupon.discountValue <= 0) {
        return Response.json(
          { error: "Discount value must be greater than 0" },
          { status: 400 }
        );
      }
    }
    if (updateCoupon.usageLimit <= 0) {
      return Response.json(
        { error: "Usage limit must be greater than 0" },
        { status: 400 }
      );
    }
    if (updateCoupon.expiryDate <= Date.now()) {
      return Response.json(
        { error: "Expiry date must be in the future" },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findByIdAndUpdate(id, updateCoupon);

    if (!coupon) {
      return Response.json({ error: "Coupon not found" }, { status: 404 });
    }
    return Response.json(coupon, { status: 200 });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return Response.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

// DELETE coupon

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await connectToDB();

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return Response.json({ error: "Coupon not found" }, { status: 404 });
    }
    return Response.json(
      { message: "Coupon deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return Response.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
