"use client"; // Required for App Router
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
  });

  useEffect(() => {
    // Retrieve cart data from localStorage
    const storedCart = JSON.parse(localStorage.getItem("shushicart")) || [];
    // Convert price to number for each item
    const normalizedCart = storedCart.map((item) => ({
      ...item,
      price:
        typeof item.price === "string"
          ? parseFloat(item.price.replace(/[^\d.]/g, ""))
          : Number(item.price),
    }));
    console.log("Stored cart:", normalizedCart);
    setCart(normalizedCart);
  }, []);

  // Calculate total using numeric price
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handleChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = { billingInfo, cart, total };

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
        localStorage.removeItem("shushicart"); // Clear correct cart key
        setCart([]); // Clear UI cart
        router.push("/");
      } else {
        console.error("Order failed with status:", response.status);
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
              <li key={item.id} className="flex justify-between  py-2">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>
                  ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 font-bold text-xl flex flex-row justify-between  border-t border-b border-gray-300 py-6 px-2">
            <p>Total </p>
            <p>₹{total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
