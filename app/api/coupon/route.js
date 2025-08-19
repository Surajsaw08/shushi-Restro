import { connectToDB } from "@/utils/db";
import Coupon from "@/models/Coupon";

export async function POST(req) {
  try {
    const couponData = await req.json();

    if (
      !couponData.code ||
      !couponData.discountType ||
      !couponData.discountValue ||
      !couponData.expiryDate
    ) {
      return Response.json(
        {
          error:
            "Code, discount type, discount value, and expiry date are required",
        },
        { status: 400 }
      );
    }
    if (couponData.discountType === "percentage") {
      if (couponData.discountValue <= 0 || couponData.discountValue > 100) {
        return Response.json(
          { error: "Discount percentage value must be between 0 and 100" },
          { status: 400 }
        );
      }
    }
    if (couponData.discountType === "fixed") {
      if (couponData.discountValue <= 0) {
        return Response.json(
          { error: "Discount value must be greater than 0" },
          { status: 400 }
        );
      }
    }
    if (couponData.usageLimit <= 0) {
      return Response.json(
        { error: "Usage limit must be greater than 0" },
        { status: 400 }
      );
    }
    if (couponData.expiryDate <= Date.now()) {
      return Response.json(
        { error: "Expiry date must be in the future" },
        { status: 400 }
      );
    }

    await connectToDB();
    const newCoupon = new Coupon(couponData);
    await newCoupon.save();
    return Response.json(newCoupon, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return Response.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDB();
    const allCoupons = await Coupon.find().sort({ createdAt: -1 });

    return Response.json(allCoupons, { status: 200 });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return Response.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}
