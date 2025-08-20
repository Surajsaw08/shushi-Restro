"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [total, setTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState(null);
  const [couponApplied, setCouponApplied] = useState(false);

  useEffect(() => {
    // Retrieve cart data from localStorage
    const storedCart = JSON.parse(localStorage.getItem("shushicart")) || [];
    const normalizedCart = storedCart.map((item) => ({
      ...item,
      price:
        typeof item.price === "string"
          ? parseFloat(item.price.replace(/[^\d.]/g, ""))
          : Number(item.price),
    }));
    setCart(normalizedCart);

    // Calculate initial total
    const sum = normalizedCart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );
    setTotal(sum);
  }, []);

  // Billing details change handler
  const handleChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  // Apply coupon
  // Apply coupon
  const applyCoupon = async () => {
    try {
      const res = await fetch("/api/couponVerification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: couponCode,
          orderTotal: total,
        }),
      });

      const data = await res.json();
      console.log("Coupon Response:", data);

      if (res.ok && data.totalval) {
        setDiscountedTotal(data.totalval);
        setCouponApplied(true);
      } else {
        alert("Invalid coupon code!");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      alert("Something went wrong while applying the coupon.");
    }
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalTotal = discountedTotal ?? total;

    const orderData = { billingInfo, cart, total: finalTotal };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();
      console.log("Server response:", responseData);

      if (response.ok) {
        alert("Order Placed Successfully!");
        localStorage.removeItem("shushicart");
        setCart([]);
        router.push("/");
      } else {
        alert("Failed to place order: " + responseData.error);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Billing Details */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
          <div className="flex flex-row w-full gap-4">
            <div className="mb-4 w-1/2">
              <label className="block font-medium mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={billingInfo.firstName}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4 w-1/2">
              <label className="block font-medium mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={billingInfo.lastName}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-400 mb-2">Phone</label>
            <input
              type="text"
              name="phone"
              value={billingInfo.phone}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block font-400 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={billingInfo.email}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block font-400 mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={billingInfo.address}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            className="mt-6 w-full bg-black text-white py-3 rounded-3xl hover:bg-gray-800 transition"
          >
            Place Order
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Order</h2>
          <div className="flex flex-row justify-between mb-6">
            <p className="font-bold text-lg ">Product</p>
            <p className="font-bold text-lg">Price</p>
          </div>
          <ul className="border-t border-b border-gray-300 py-6 px-2">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between py-2">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>
                  ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          {/* Coupon Input */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full border rounded p-2"
            />
            <button
              onClick={applyCoupon}
              type="button"
              disabled={couponApplied} // prevent clicking again
              className={`px-4 py-2 rounded text-white ${
                couponApplied
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {couponApplied ? "Applied" : "Apply"}
            </button>
          </div>

          {/* Total */}
          <div className="mt-4 font-bold text-xl flex flex-row justify-between border-t border-b border-gray-300 py-6 px-2">
            <p>Total</p>
            <p>₹{(discountedTotal ?? total).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
