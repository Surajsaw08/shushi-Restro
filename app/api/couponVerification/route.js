import { connectToDB } from "@/utils/db";
import Coupon from "@/models/Coupon";

export async function POST(req) {
  try {
    const couponData = await req.json();
    await connectToDB();
    const coupon = await Coupon.findOne({ code: couponData.couponCode });

    if (coupon) {
      if (coupon.expirationDate < Date.now()) {
        return Response.json({ message: "Coupon expired" }, { status: 400 });
      }
      if (coupon.usageLimit <= 0) {
        return Response.json(
          { message: "Coupon usage limit reached" },
          { status: 400 }
        );
      }
      if (coupon.minOrderValue > couponData.orderTotal) {
        return Response.json(
          { message: "Coupon min order value not reached" },
          { status: 400 }
        );
      }
      if (coupon.isActive === false) {
        return Response.json({ message: "Coupon not active" }, { status: 400 });
      }
      // coupon.usedCount += 1;
      // coupon.usageLimit -= 1;
      await coupon.save();

      if (coupon.discountType === "percentage") {
        const discount = (coupon.discountValue / 100) * couponData.orderTotal;

        if (discount > coupon.maxDiscountAmount) {
          const totalval = couponData.orderTotal - coupon.maxDiscountAmount;
          return Response.json({ totalval }, { status: 200 });
        } else {
          const totalval = couponData.orderTotal - discount;
          return Response.json({ totalval }, { status: 200 });
        }
      }

      const totalval = couponData.orderTotal - coupon.discountValue;
      return Response.json({ totalval }, { status: 200 });
    } else {
      return Response.json({ message: "Coupon not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return Response.json({ error: "Failed to fetch coupon" }, { status: 500 });
  }
}
