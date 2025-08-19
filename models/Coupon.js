// models/Coupon.js
import mongoose from "mongoose";

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // automatically store in uppercase
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"], // % discount or fixed amount
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    maxDiscountAmount: {
      type: Number,
      default: 0,
    },
    usageLimit: {
      type: Number, // how many times coupon can be used in total
      default: 100,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite on hot reload in Next.js
export default mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
