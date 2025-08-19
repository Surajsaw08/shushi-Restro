// app/menu/page.jsx
"use client";

import { useState, useEffect } from "react";

const MenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    status: "Available",
    imageUrl: "",
  });
  const [editingItem, setEditingItem] = useState(null);

  // Fetch menu items from the database
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/menu");
        if (!response.ok) throw new Error("Failed to fetch menu items");
        const data = await response.json();
        setMenuItems(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load menu items. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem({ ...editingItem, [name]: value });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  const handleAddMenuItem = async () => {
    if (!newItem.name || !newItem.category || !newItem.price) return;

    try {
      const itemToAdd = {
        ...newItem,
        price: parseFloat(newItem.price),
        imageUrl:
          newItem.imageUrl ||
          `https://placehold.co/60x60/CCCCCC/000000?text=${newItem.category.substring(
            0,
            5
          )}`,
      };

      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemToAdd),
      });

      if (!response.ok) throw new Error("Failed to add menu item");

      const addedItem = await response.json();
      setMenuItems([...menuItems, addedItem]);
      setNewItem({
        name: "",
        category: "",
        price: "",
        status: "Available",
        imageUrl: "",
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to add menu item. Please try again.");
    }
  };

  const handleEditMenuItem = (item) => {
    setEditingItem({ ...item });
  };

  const handleUpdateMenuItem = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(`/api/menu/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingItem,
          price: parseFloat(editingItem.price),
        }),
      });

      if (!response.ok) throw new Error("Failed to update menu item");

      const updatedItem = await response.json();
      setMenuItems((prev) =>
        prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
      );
      setEditingItem(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update menu item. Please try again.");
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete menu item");

      setMenuItems((prev) => prev.filter((item) => item._id !== id));
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete menu item. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <header className="mb-8 pb-4 border-b border-gray-200 text-center">
        <h1 className="text-4xl font-bold text-gray-800">🍽️ Menu Management</h1>
        <p className="text-gray-600 mt-2">
          Add, edit, and manage your menu items.
        </p>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
          {error}
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <span className="text-red-500">×</span>
          </button>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 bg-white p-6 rounded-lg shadow-md">
        {/* Add/Edit Form */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
          <h3 className="text-2xl font-semibold mb-6 text-gray-700">
            {editingItem ? "✏️ Edit Menu Item" : "➕ Add New Menu Item"}
          </h3>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["name", "category", "price", "status", "imageUrl"].map(
              (field) => (
                <div
                  key={field}
                  className={field === "imageUrl" ? "md:col-span-2" : ""}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === "name" && "🍴 Dish Name"}
                    {field === "category" && "🏷️ Category"}
                    {field === "price" && "💰 Price ($)"}
                    {field === "status" && "📦 Status"}
                    {field === "imageUrl" && "🖼️ Image URL"}
                  </label>
                  {field === "status" ? (
                    <select
                      name="status"
                      value={editingItem ? editingItem.status : newItem.status}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Available">Available</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  ) : (
                    <input
                      type={field === "price" ? "number" : "text"}
                      name={field}
                      value={editingItem ? editingItem[field] : newItem[field]}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500"
                    />
                  )}
                </div>
              )
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            {editingItem ? (
              <>
                <button
                  onClick={handleUpdateMenuItem}
                  className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  ✅ Update Item
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  ❌ Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAddMenuItem}
                className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                ➕ Add Item
              </button>
            )}
          </div>
        </div>

        {/* Menu Items Table */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-orange-500 rounded-full"></div>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
            <p className="text-gray-600">
              No menu items found. Add your first one!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600 uppercase text-sm">
                  <th className="py-3 px-6 text-left">#</th>
                  <th className="py-3 px-6 text-left">Image</th>
                  <th className="py-3 px-6 text-left">Dish Name</th>
                  <th className="py-3 px-6 text-left">Category</th>
                  <th className="py-3 px-6 text-left">Price</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item, i) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">{i + 1}</td>
                    <td className="py-3 px-6">
                      <img
                        src={
                          item.imageUrl ||
                          "https://placehold.co/60x60/CCCCCC/000000?text=No+Image"
                        }
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    </td>
                    <td className="py-3 px-6 text-orange-600 font-semibold">
                      {item.name}
                    </td>
                    <td className="py-3 px-6">{item.category}</td>
                    <td className="py-3 px-6">${item.price.toFixed(2)}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Available"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => handleEditMenuItem(item)}
                        className="text-blue-500 hover:text-blue-700 px-2"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item._id)}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} RestoAdmin. All rights reserved.
      </footer>
    </div>
  );
};

export default MenuManagementPage;
