"use client";
import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

// Create a context
const CartContext = createContext();

// Create a provider component
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const router = useRouter();

  const addToCart2 = (dish) => {
    setCart((prevCart) => {
      const itemExist = prevCart.find((item) => item.id === dish.id);
      if (itemExist) {
        return prevCart.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...dish, quantity: 1 }];
    });
  };

  const onCartClick = () => setShowCart(!showCart);
  const closeCart = () => setShowCart(false);
  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };
  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };
  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  const checkout = () => {
    localStorage.setItem("shushicart", JSON.stringify(cart));
    router.push("/checkout"); // Navigate to checkout
    closeCart(); // Close the cart after checkout
  };

  const totalAmount = cart.reduce((sum, item) => {
    // Ensure price is a number
    const priceNum =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/[^\d.]/g, ""))
        : Number(item.price);
    return sum + priceNum * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart2, onCartClick }}>
      {children}
      {showCart && (
        <div className="fixed top-20 right-0 w-2/6 h-[85%] bg-customOrange shadow-2xl rounded-lg p-6 flex flex-col transition-transform duration-300 z-20 ">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Cart</h3>
            <button
              onClick={closeCart}
              className="text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              &times;
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <ul className="flex-grow overflow-y-auto">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-[10px] py-1 bg-gray-200 rounded-xl hover:bg-gray-300"
                    >
                      -
                    </button>
                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="px-2 py-1 bg-gray-200 rounded-xl hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="px-2 py-1 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                    <p className="font-semibold">
                      {item.price} x {item.quantity} = ₹
                      {parseInt(item.price.replace("₹", "")) * item.quantity}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {cart.length > 0 && (
            <>
              <div className="mt-4 mb-2 text-right font-bold text-lg">
                Total: ₹{totalAmount.toFixed(2)}
              </div>
              <div className="mt-2">
                <button
                  onClick={checkout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded text-lg"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => useContext(CartContext);

export default CartProvider;
