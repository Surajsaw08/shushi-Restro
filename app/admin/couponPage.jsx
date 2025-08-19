"use client";

import { useState, useEffect } from "react";

export default function CouponManagementPage() {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderValue: "",
    maxDiscountAmount: "",
    expiryDate: "",
    usageLimit: "",
    isActive: true,
  });
  const [editingCoupon, setEditingCoupon] = useState(null);

  // ✅ Fetch coupons from API
  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch("/api/coupon");
      if (!response.ok) {
        throw new Error("Failed to fetch coupons");
      }
      const data = await response.json();
      setCoupons(data);
    } catch (err) {
      console.error("💥 Error fetching coupons:", err);
    }
  };

  // ✅ Input change handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;

    if (editingCoupon) {
      setEditingCoupon({ ...editingCoupon, [name]: finalValue });
    } else {
      setNewCoupon({ ...newCoupon, [name]: finalValue });
    }
  };

  // ✅ Add coupon (POST request)
  const handleAddCoupon = async () => {
    if (newCoupon.code && newCoupon.discountValue && newCoupon.expiryDate) {
      try {
        const res = await fetch("/api/coupon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newCoupon,
            code: newCoupon.code.toUpperCase(),
            discountValue: parseFloat(newCoupon.discountValue),
            minOrderValue: parseFloat(newCoupon.minOrderValue || "0"),
            maxDiscountAmount:
              newCoupon.discountType === "percentage"
                ? parseFloat(newCoupon.maxDiscountAmount)
                : parseFloat(newCoupon.discountValue),
            usageLimit: parseInt(newCoupon.usageLimit || "1"),
          }),
        });
        const data = await res.json();
        if (res.ok) {
          fetchCoupons();
          setNewCoupon({
            code: "",
            discountType: "percentage",
            discountValue: "",
            minOrderValue: "",
            maxDiscountAmount: "",
            expiryDate: "",
            usageLimit: "",
            isActive: true,
          });
        }
      } catch (err) {
        console.error("Error adding coupon:", err);
      }
    }
  };

  // ✅ Edit coupon (PUT request)
  const handleUpdateCoupon = async () => {
    if (editingCoupon) {
      try {
        const res = await fetch(`/api/coupon/${editingCoupon._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editingCoupon,
            code: editingCoupon.code.toUpperCase(),
            discountValue: parseFloat(editingCoupon.discountValue),
            minOrderValue: parseFloat(editingCoupon.minOrderValue || 0),
            maxDiscountAmount:
              editingCoupon.discountType === "percentage" &&
              editingCoupon.maxDiscountAmount
                ? parseFloat(editingCoupon.maxDiscountAmount)
                : null,
            usageLimit: parseInt(editingCoupon.usageLimit || 1),
          }),
        });
        const data = await res.json();
        if (res.ok) {
          fetchCoupons();
          setEditingCoupon(null);
        }
      } catch (err) {
        console.error("Error updating coupon:", err);
      }
    }
  };

  // ✅ Delete coupon (DELETE request)
  const handleDeleteCoupon = async (id) => {
    try {
      const res = await fetch(`/api/coupon/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        fetchCoupons();
      }
    } catch (err) {
      console.error("Error deleting coupon:", err);
    }
  };

  const handleEditCoupon = (coupon) => setEditingCoupon({ ...coupon });

  const isExpired = (expiryDate) => new Date(expiryDate) < new Date();
  const isExhausted = (usedCount, usageLimit) => usedCount >= usageLimit;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {/* HEADER */}
      <header className="mb-6 text-center border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-800">Coupon Management</h1>
        <p className="text-gray-600 mt-2">
          Manage discount codes and promotional offers.
        </p>
      </header>

      {/* FORM */}
      <main className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          {editingCoupon ? "✏️ Edit Coupon" : "➕ Add New Coupon"}
        </h2>

        {/* FORM INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            name="code"
            placeholder="Coupon Code (auto-uppercase)"
            value={editingCoupon ? editingCoupon.code : newCoupon.code}
            onChange={handleInputChange}
            className="p-2 border rounded"
            style={{ textTransform: "uppercase" }}
          />
          <select
            name="discountType"
            value={
              editingCoupon
                ? editingCoupon.discountType
                : newCoupon.discountType
            }
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
          <input
            type="number"
            name="discountValue"
            placeholder="Discount Value"
            value={
              editingCoupon
                ? editingCoupon.discountValue
                : newCoupon.discountValue
            }
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="minOrderValue"
            placeholder="Min Order Value"
            value={
              editingCoupon
                ? editingCoupon.minOrderValue
                : newCoupon.minOrderValue
            }
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          {(editingCoupon
            ? editingCoupon.discountType
            : newCoupon.discountType) === "percentage" && (
            <input
              type="number"
              name="maxDiscountAmount"
              placeholder="Max Discount ($)"
              value={
                editingCoupon
                  ? editingCoupon.maxDiscountAmount || ""
                  : newCoupon.maxDiscountAmount
              }
              onChange={handleInputChange}
              className="p-2 border rounded"
            />
          )}
          <input
            type="date"
            name="expiryDate"
            value={
              editingCoupon ? editingCoupon.expiryDate : newCoupon.expiryDate
            }
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="usageLimit"
            placeholder="Usage Limit"
            value={
              editingCoupon ? editingCoupon.usageLimit : newCoupon.usageLimit
            }
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <div className="flex items-center p-2">
            <input
              type="checkbox"
              name="isActive"
              checked={
                editingCoupon ? editingCoupon.isActive : newCoupon.isActive
              }
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-gray-700">Active</label>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 mb-6">
          {editingCoupon ? (
            <>
              <button
                onClick={handleUpdateCoupon}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Update Coupon
              </button>
              <button
                onClick={() => setEditingCoupon(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAddCoupon}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Coupon
            </button>
          )}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-r">Code</th>
                <th className="p-3 border-r">Type</th>
                <th className="p-3 border-r">Value</th>
                <th className="p-3 border-r">Max Discount</th>
                <th className="p-3 border-r">Min Order</th>
                <th className="p-3 border-r">Expiry</th>
                <th className="p-3 border-r">Usage</th>
                <th className="p-3 border-r">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => {
                const expired = isExpired(coupon.expiryDate);
                const exhausted = isExhausted(
                  coupon.usedCount,
                  coupon.usageLimit
                );

                return (
                  <tr key={coupon._id} className="border-t hover:bg-gray-50">
                    <td className="p-3 border-r font-mono font-bold">
                      {coupon.code}
                    </td>
                    <td className="p-3 border-r capitalize">
                      {coupon.discountType}
                    </td>
                    <td className="p-3 border-r">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue.toFixed(2)}`}
                    </td>
                    <td className="p-3 border-r">
                      {coupon.discountType === "percentage" &&
                      coupon.maxDiscountAmount
                        ? `$${coupon.maxDiscountAmount.toFixed(2)}`
                        : coupon.discountType === "percentage"
                        ? "No limit"
                        : "N/A"}
                    </td>
                    <td className="p-3 border-r">
                      ${coupon.minOrderValue.toFixed(2)}
                    </td>
                    <td className="p-3 border-r">
                      <span
                        className={expired ? "text-red-600 font-semibold" : ""}
                      >
                        {coupon.expiryDate}
                        {expired && " (Expired)"}
                      </span>
                    </td>
                    <td className="p-3 border-r">
                      <span
                        className={
                          exhausted ? "text-orange-600 font-semibold" : ""
                        }
                      >
                        {coupon.usedCount} / {coupon.usageLimit}
                        {exhausted && " (Full)"}
                      </span>
                    </td>
                    <td className="p-3 border-r">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          coupon.isActive && !expired && !exhausted
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {coupon.isActive && !expired && !exhausted
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEditCoupon(coupon)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {coupons.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No coupons found. Add your first coupon above!
          </div>
        )}
      </main>

      <footer className="text-center text-sm text-gray-500 mt-6 border-t pt-4">
        <p>
          &copy; {new Date().getFullYear()} RestoAdmin. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
