import React from "react";

const Products = ({ product, addToCart }) => {
  return (
    <div>
      <div className="border rounded-lg shadow-lg p-6 flex flex-col items-center bg-white">
        <h2 className="text-xl font-semibold text-black">{product.name}</h2>
        <p className="text-gray-600 text-lg">₹{product.price}</p>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Products;
