"use client";
import { useState } from "react";
import OrderDetail from "./orderdetail";
import DashboardPage from "./dashboard";
import CouponManagementPage from "./couponPage";
import MenuManagementPage from "./menuPage";

export default function Home() {
  const [section, setSection] = useState("dashboard");

  const renderSection = () => {
    switch (section) {
      case "menu":
        return <MenuManagement />;
      case "orders":
        return <OrderManagement />;
      case "cupons":
        return <CouponManagement />;
      case "users":
        return <UserManagement />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-orange-400 mb-8">Shushi</h1>
        <nav className="flex-grow space-y-2">
          {["dashboard", "menu", "orders", "cupons", "users", "settings"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setSection(item)}
                className={`block w-full text-left px-4 py-2 rounded ${
                  section === item
                    ? "bg-orange-500 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            )
          )}
        </nav>
        <footer className="mt-auto text-sm text-gray-400">
          &copy; 2025 ShushiRestoAdmin
        </footer>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* <h2 className="text-3xl font-semibold mb-6 capitalize">{section}</h2> */}
        <div className="bg-white rounded shadow p-6">{renderSection()}</div>
      </main>
    </div>
  );
}

// ==== Section: Dashboard ====
function DashboardOverview() {
  return (
    <div>
      <DashboardPage />
    </div>
  );
}

// ==== Section: Menu ====
function MenuManagement() {
  return (
    <div>
      <p>Menu management section</p>
      <MenuManagementPage />
    </div>
  );
}

// ==== Section: Orders ====
function OrderManagement() {
  return (
    <div>
      <OrderDetail />
    </div>
  );
}

// ==== Section: Coupon ====
function CouponManagement() {
  return (
    <div>
      <CouponManagementPage />
    </div>
  );
}

// ==== Section: Users ====
function UserManagement() {
  return (
    <div>
      <p>User management section</p>
    </div>
  );
}

// ==== Section: Settings ====
function SettingsSection() {
  return (
    <div>
      <p>Settings section</p>
    </div>
  );
}
