"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/orders/admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        
        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Stats data based on API response
  const stats = dashboardData ? [
    {
      label: "Total Sales (All Time)",
      value: formatCurrency(dashboardData.totalSales),
      icon: "💰",
      color: "text-green-500",
    },
    {
      label: "New Orders (Today)",
      value: dashboardData.todayOrderCount.toString(),
      icon: "🔔",
      color: "text-blue-500",
    },
    {
      label: "Today's Sales",
      value: formatCurrency(dashboardData.todaySales),
      icon: "📅",
      color: "text-indigo-500",
    },
    {
      label: "Weekly Sales",
      value: formatCurrency(dashboardData.weeklySales),
      icon: "📅",
      color: "text-teal-500",
    },
    {
      label: "Monthly Sales",
      value: formatCurrency(dashboardData.monthlySales),
      icon: "📅",
      color: "text-orange-500",
    },
    {
      label: "Yearly Sales",
      value: formatCurrency(dashboardData.yearlySales),
      icon: "📅",
      color: "text-pink-500",
    },
    {
      label: "Pending Orders",
      value: dashboardData.pendingOrderCount.toString(),
      icon: "⏱️",
      color: "text-yellow-500",
    },
  ] : [];

  // Format recent orders from API data
  const recentOrders = dashboardData?.recentOrders ? dashboardData.recentOrders.map(order => ({
    id: `#${order._id.slice(-6)}`,
    customer: `${order.billingInfo.firstName} ${order.billingInfo.lastName}`,
    total: formatCurrency(order.total),
    status: order.status,
    time: new Date(order.createdAt).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  })) : [
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-inter p-8">
      {/* Main Content Area - Dashboard Overview */}
      <main className="flex-1 bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-600">Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-semibold mb-6 text-gray-700">Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-white p-5 rounded-lg shadow-sm flex items-center justify-between border border-gray-200 transform hover:scale-105 transition-transform duration-200 ${stat.label === "Pending Orders" ? "cursor-pointer" : ""}`}
                  onClick={() => {
                    if (stat.label === "Pending Orders") {
                      window.location.href = "/admin/pendingorders";
                    }
                  }}
                >
                  <div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    {stat.label === "Pending Orders" && (
                      <p className="text-xs text-blue-500 mt-1">Click to view and manage</p>
                    )}
                  </div>
                  <span className={`text-3xl ${stat.color}`}>{stat.icon}</span>
                </div>
              ))}
            </div>

            {/* Recent Orders Section */}
            <h3 className="text-2xl font-semibold mb-6 text-gray-700">
              Recent Orders
            </h3>
            {recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Order ID</th>
                      <th className="py-3 px-6 text-left">Customer</th>
                      <th className="py-3 px-6 text-left">Total</th>
                      <th className="py-3 px-6 text-left">Status</th>
                      <th className="py-3 px-6 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700 text-sm font-light">
                    {recentOrders.map((order, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          {order.id}
                        </td>
                        <td className="py-3 px-6 text-left">{order.customer}</td>
                        <td className="py-3 px-6 text-left">{order.total}</td>
                        <td className="py-3 px-6 text-left">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "Completed"
                                ? "bg-green-200 text-green-800"
                                : order.status === "Pending"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-blue-200 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-left">{order.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-4">No recent orders found</p>
            )}
          </>
        )}
      </main>

      {/* Footer Section */}
      <footer className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} RestoAdmin. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
