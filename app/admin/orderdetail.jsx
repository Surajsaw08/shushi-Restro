"use client";

import { useEffect, useState } from "react";

export default function OrderDetail() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders/admin");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
        alert("Order status updated!");
        fetchOrders(); // Refresh orders after update
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Something went wrong!");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter === "All" || order.status === statusFilter) &&
      (order.billingInfo.firstName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
        order.billingInfo.lastName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        order.billingInfo.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Search & Filter */}
      <div className="flex flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border p-2 rounded w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Customer Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Total Amount</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date</th>
            {/* <th className="border p-2">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id} className="border">
              <td className="border p-2">{order._id.slice(-6)}</td>
              <td className="border p-2">
                {order.billingInfo.firstName} {order.billingInfo.lastName}
              </td>
              <td className="border p-2">{order.billingInfo.phone}</td>
              <td className="border p-2">{order.billingInfo.email}</td>
              <td className="border p-2">₹{order.total.toFixed(2)}</td>
              <td className="border p-2">
                <select
                  className="border p-1 rounded"
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
              <td className="border p-2">{order.createdAt.split("T")[0]}</td>

              {/*  if we want to change status to complete */}
              {/* <td className="border p-2">
                <button
                  onClick={() => updateStatus(order._id, "Completed")}
                  className="bg-green-400 text-white px-3 py-1 rounded"
                >
                  Completed
                </button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
