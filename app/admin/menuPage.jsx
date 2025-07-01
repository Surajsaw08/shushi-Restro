// app/menu/page.jsx
"use client";

import { useState } from "react";

const MenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Margherita Pizza",
      category: "Pizza",
      price: 12.99,
      status: "Available",
      imageUrl: "https://placehold.co/60x60/FFD700/000000?text=Pizza",
    },
    {
      id: 2,
      name: "Caesar Salad",
      category: "Salad",
      price: 8.5,
      status: "Available",
      imageUrl: "https://placehold.co/60x60/90EE90/000000?text=Salad",
    },
    {
      id: 3,
      name: "Spaghetti Bolognese",
      category: "Pasta",
      price: 15.75,
      status: "Available",
      imageUrl: "https://placehold.co/60x60/ADD8E6/000000?text=Pasta",
    },
    {
      id: 4,
      name: "Cheeseburger",
      category: "Burgers",
      price: 10.0,
      status: "Out of Stock",
      imageUrl: "https://placehold.co/60x60/F08080/000000?text=Burger",
    },
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    status: "Available",
    imageUrl: "",
  });

  const [editingItem, setEditingItem] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingItem) {
      setEditingItem({ ...editingItem, [name]: value });
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  const handleAddMenuItem = () => {
    if (newItem.name && newItem.category && newItem.price) {
      setMenuItems([
        ...menuItems,
        {
          ...newItem,
          id:
            menuItems.length > 0
              ? Math.max(...menuItems.map((item) => item.id)) + 1
              : 1,
          price: parseFloat(newItem.price),
          imageUrl:
            newItem.imageUrl ||
            `https://placehold.co/60x60/CCCCCC/000000?text=${newItem.category.substring(
              0,
              5
            )}`,
        },
      ]);
      setNewItem({
        name: "",
        category: "",
        price: "",
        status: "Available",
        imageUrl: "",
      });
    }
  };

  const handleEditMenuItem = (item) => {
    setEditingItem({ ...item });
  };

  const handleUpdateMenuItem = () => {
    if (editingItem) {
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingItem.id
            ? { ...editingItem, price: parseFloat(editingItem.price) }
            : item
        )
      );
      setEditingItem(null);
    }
  };

  const handleDeleteMenuItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-8">
      {/* Header Section */}
      <header className="mb-8 pb-4 border-b border-gray-200 text-center">
        <h1 className="text-4xl font-bold text-gray-800">🍽️ Menu Management</h1>
        <p className="text-gray-600 mt-2">
          Add, edit, and manage your restaurant's menu items.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-white p-6 rounded-lg shadow-md">
        {/* Add/Edit Menu Item Form */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
          <h3 className="text-2xl font-semibold mb-6 text-gray-700">
            {editingItem ? "✏️ Edit Menu Item" : "➕ Add New Menu Item"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dish Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                🍴 Dish Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g., Chicken Alfredo"
                value={editingItem ? editingItem.name : newItem.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                🏷️ Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                placeholder="e.g., Pasta, Appetizer"
                value={editingItem ? editingItem.category : newItem.category}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                💰 Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="e.g., 18.99"
                value={editingItem ? editingItem.price : newItem.price}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                📦 Status
              </label>
              <select
                id="status"
                name="status"
                value={editingItem ? editingItem.status : newItem.status}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                🖼️ Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                placeholder="e.g., https://example.com/pizza.jpg"
                value={editingItem ? editingItem.imageUrl : newItem.imageUrl}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {editingItem ? (
              <>
                <button
                  onClick={handleUpdateMenuItem}
                  className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 shadow-md"
                >
                  ✅ Update Item
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200 shadow-md"
                >
                  ❌ Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAddMenuItem}
                className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 shadow-md"
              >
                ➕ Add Item
              </button>
            )}
          </div>
        </div>

        {/* Menu Items List Table */}
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">
          📋 All Menu Items
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">#</th>
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-left">Dish Name</th>
                <th className="py-3 px-6 text-left">Category</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {menuItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6 text-left">{item.id}</td>
                  <td className="py-3 px-6 text-left">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/60x60/CCCCCC/000000?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-6 text-left font-semibold text-orange-600">
                    {item.name}
                  </td>
                  <td className="py-3 px-6 text-left">{item.category}</td>
                  <td className="py-3 px-6 text-left">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-6 text-left">
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
                    <div className="flex item-center justify-center space-x-2">
                      <button
                        onClick={() => handleEditMenuItem(item)}
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-1 rounded-md hover:bg-blue-100"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded-md hover:bg-red-100"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} RestoAdmin. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default MenuManagementPage;
