"use client";

import { useState } from "react";
import Products from "./Products";
import { Cart } from "./Cart";

const products = [
  { id: 1, name: "Shirt", price: 842 },
  { id: 2, name: "Perfume", price: 699 },
  { id: 3, name: "Headphones", price: 1999 },
  { id: 4, name: "Book", price: 399 },
  { id: 5, name: "Smartwatch", price: 2499 },
  { id: 6, name: "Camera", price: 5999 },
  { id: 7, name: "Mouse", price: 499 },
  { id: 8, name: "Earbuds", price: 1499 },
  { id: 9, name: "Notebook", price: 130 },
  { id: 10, name: "Charger", price: 452 },
  { id: 11, name: "shoe", price: 1452 },
  { id: 12, name: "belt", price: 452 },
];

export default function ProductList() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-center">OUR PRODUCTS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map((product) => (
          <Products key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
      <Cart cart={cart} removeFromCart={removeFromCart} />
    </>
  );
}
