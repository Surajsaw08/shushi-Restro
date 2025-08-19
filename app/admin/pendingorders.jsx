"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders/admin");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      // Filter only pending orders and sort by creation time (newest first)
      const pendingOrders = data
        .filter((order) => order.status === "Pending")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(pendingOrders);
      setError(null);
    } catch (error) {
      console.error("Error fetching pending orders:", error);
      setError("Failed to load pending orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch("/api/orders/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        // Update the local state to reflect the change
        setOrders(orders.filter((order) => order._id !== orderId));
        alert("Order status updated to Completed!");
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Something went wrong!");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-inter p-8">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Link href="/admin/" className="mr-4 text-blue-500 hover:text-blue-700">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Pending Orders</h1>
      </div>

      {/* Main Content */}
      <main className="flex-1 bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-600">Loading pending orders...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-600">No pending orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Order ID</th>
                  <th className="py-3 px-6 text-left">Customer</th>
                  <th className="py-3 px-6 text-left">Phone</th>
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Address</th>
                  <th className="py-3 px-6 text-left">Total</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {order.billingInfo.firstName} {order.billingInfo.lastName}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {order.billingInfo.phone}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {order.billingInfo.email}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {order.billingInfo.address}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <button
                        onClick={() => updateStatus(order._id, "Completed")}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition duration-200"
                      >
                        Mark Completed
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} RestoAdmin. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
