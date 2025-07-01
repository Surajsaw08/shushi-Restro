const DashboardPage = () => {
  // Dummy data for dashboard metrics
  const stats = [
    {
      label: "Total Sales (All Time)",
      value: "$12,345",
      icon: "💰",
      color: "text-green-500",
    },
    {
      label: "New Orders (Today)",
      value: "78",
      icon: "🔔",
      color: "text-blue-500",
    },
    {
      label: "Dishes Sold (Today)",
      value: "456",
      icon: "🍽️",
      color: "text-purple-500",
    },
    {
      label: "Daily Visitors",
      value: "1,230",
      icon: "📈",
      color: "text-red-500",
    },
    {
      label: "Today's Sales",
      value: "$850.75",
      icon: "📅",
      color: "text-indigo-500",
    },
    {
      label: "Weekly Sales",
      value: "$5,200.00",
      icon: "📅",
      color: "text-teal-500",
    },
    {
      label: "Monthly Sales",
      value: "$20,500.00",
      icon: "📅",
      color: "text-orange-500",
    },
    {
      label: "Yearly Sales",
      value: "$240,000.00",
      icon: "📅",
      color: "text-pink-500",
    },
    {
      label: "Pending Orders",
      value: "15",
      icon: "⏱️",
      color: "text-yellow-500",
    },
  ];

  const recentOrders = [
    {
      id: "#001",
      customer: "Alice Smith",
      total: "$45.00",
      status: "Completed",
      time: "10:30 AM",
    },
    {
      id: "#002",
      customer: "Bob Johnson",
      total: "$22.50",
      status: "Pending",
      time: "11:15 AM",
    },
    {
      id: "#003",
      customer: "Charlie Brown",
      total: "$60.00",
      status: "Preparing",
      time: "12:00 PM",
    },
    {
      id: "#004",
      customer: "Diana Prince",
      total: "$30.00",
      status: "Completed",
      time: "01:00 PM",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-inter p-8">
      {/* Header Section */}
      <header className="mb-8 pb-4 border-b border-gray-200 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Restaurant Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Quick overview of your restaurant's key metrics.
        </p>
      </header>

      {/* Main Content Area - Dashboard Overview */}
      <main className="flex-1 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-sm flex items-center justify-between border border-gray-200 transform hover:scale-105 transition-transform duration-200"
            >
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <span className={`text-3xl ${stat.color}`}>{stat.icon}</span>
            </div>
          ))}
        </div>

        {/* Recent Orders Section */}
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">
          Recent Orders
        </h3>
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
      </main>

      {/* Footer Section */}
      <footer className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>&copy; 2024 RestoAdmin. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
