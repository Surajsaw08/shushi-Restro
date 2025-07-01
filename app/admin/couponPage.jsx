"use client";

import { useState } from "react";

export default function CouponManagementPage() {
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: "SAVE10",
      type: "Percentage",
      value: 10,
      minOrder: 50,
      expiry: "2025-12-31",
      status: "Active",
    },
    {
      id: 2,
      code: "FREEDELIVERY",
      type: "Fixed Amount",
      value: 5,
      minOrder: 25,
      expiry: "2024-11-15",
      status: "Inactive",
    },
    {
      id: 3,
      code: "BUYONEGETONE",
      type: "BOGO",
      value: 0,
      minOrder: 0,
      expiry: "2025-06-30",
      status: "Active",
    },
  ]);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "Percentage",
    value: "",
    minOrder: "",
    expiry: "",
    status: "Active",
  });

  const [editingCoupon, setEditingCoupon] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingCoupon) {
      setEditingCoupon({ ...editingCoupon, [name]: value });
    } else {
      setNewCoupon({ ...newCoupon, [name]: value });
    }
  };

  const handleAddCoupon = () => {
    if (newCoupon.code && newCoupon.value && newCoupon.expiry) {
      const newId = coupons.length > 0 ? Math.max(...coupons.map((c) => c.id)) + 1 : 1;
      const coupon = {
        ...newCoupon,
        id: newId,
        value: parseFloat(newCoupon.value),
        minOrder: parseFloat(newCoupon.minOrder || "0"),
      };
      setCoupons([...coupons, coupon]);
      setNewCoupon({
        code: "",
        type: "Percentage",
        value: "",
        minOrder: "",
        expiry: "",
        status: "Active",
      });
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon({ ...coupon });
  };

  const handleUpdateCoupon = () => {
    if (editingCoupon) {
      setCoupons(
        coupons.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...editingCoupon,
                value: parseFloat(editingCoupon.value),
                minOrder: parseFloat(editingCoupon.minOrder || 0),
              }
            : c
        )
      );
      setEditingCoupon(null);
    }
  };

  const handleDeleteCoupon = (id) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== id));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <header className="mb-6 text-center border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">Coupon Management</h1>
        <p className="text-gray-600 mt-2">Manage discount codes and promotional offers.</p>
      </header>

      <main className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          {editingCoupon ? "✏️ Edit Coupon" : "➕ Add New Coupon"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="code"
            placeholder="Coupon Code"
            value={editingCoupon ? editingCoupon.code : newCoupon.code}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <select
            name="type"
            value={editingCoupon ? editingCoupon.type : newCoupon.type}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="Percentage">Percentage</option>
            <option value="Fixed Amount">Fixed Amount</option>
            <option value="BOGO">BOGO</option>
          </select>
          <input
            type="number"
            name="value"
            placeholder="Value"
            value={editingCoupon ? editingCoupon.value : newCoupon.value}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="minOrder"
            placeholder="Min Order"
            value={editingCoupon ? editingCoupon.minOrder : newCoupon.minOrder}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="date"
            name="expiry"
            value={editingCoupon ? editingCoupon.expiry : newCoupon.expiry}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <select
            name="status"
            value={editingCoupon ? editingCoupon.status : newCoupon.status}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex gap-3 mb-6">
          {editingCoupon ? (
            <>
              <button onClick={handleUpdateCoupon} className="px-4 py-2 bg-orange-500 text-white rounded">Update</button>
              <button onClick={() => setEditingCoupon(null)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
            </>
          ) : (
            <button onClick={handleAddCoupon} className="px-4 py-2 bg-green-500 text-white rounded">Add Coupon</button>
          )}
        </div>

        <table className="min-w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Code</th>
              <th className="p-2">Type</th>
              <th className="p-2">Value</th>
              <th className="p-2">Min Order</th>
              <th className="p-2">Expiry</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-t">
                <td className="p-2">{coupon.code}</td>
                <td className="p-2">{coupon.type}</td>
                <td className="p-2">
                  {coupon.type === "Percentage"
                    ? `${coupon.value}%`
                    : coupon.type === "Fixed Amount"
                    ? `$${coupon.value.toFixed(2)}`
                    : "N/A"}
                </td>
                <td className="p-2">${coupon.minOrder.toFixed(2)}</td>
                <td className="p-2">{coupon.expiry}</td>
                <td className="p-2">{coupon.status}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => handleEditCoupon(coupon)} className="text-blue-500">Edit</button>
                  <button onClick={() => handleDeleteCoupon(coupon.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer className="text-center text-sm text-gray-500 mt-6 border-t pt-4">
        <p>&copy; {new Date().getFullYear()} RestoAdmin. All rights reserved.</p>
      </footer>
    </div>
  );
}
