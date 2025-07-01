// import { useRouter } from "next/navigation";

// export function Cart({ cart, removeFromCart }) {
//   const router = useRouter();
//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   const handleCheckout = () => {
//     localStorage.setItem("cart", JSON.stringify(cart)); // Save cart to localStorage
//     router.push("/checkout"); // Navigate to checkout
//   };

//   return (
//     <div className="mt-8">
//       <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
//       {cart.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <>
//           <ul className="space-y-2">
//             {cart.map((item) => (
//               <li
//                 key={item.id}
//                 className="flex border rounded-md px-4 py-2 justify-between items-center"
//               >
//                 <span>
//                   {item.name} - ₹{item.price.toFixed(2)} x {item.quantity}
//                 </span>
//                 <button
//                   className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//                   onClick={() => removeFromCart(item.id)}
//                 >
//                   Remove
//                 </button>
//               </li>
//             ))}
//           </ul>
//           <p className="mt-4 text-xl font-bold">Total: ₹{total.toFixed(2)}</p>
//         </>
//       )}
//       <div className="flex items-center justify-center">
//         <button
//           className="bg-black text-white px-4 py-2 border rounded-md hover:bg-blue-600 transition"
//           onClick={handleCheckout}
//         >
//           Checkout
//         </button>
//       </div>
//     </div>
//   );
// }
