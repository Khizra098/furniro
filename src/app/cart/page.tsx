
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "../../../types/products";
import { getCartItems, removeFromCart, updateCartQuantity } from "../actions/actions";
import Swal from "sweetalert2";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const handleRemove = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(id);
        setCartItems(getCartItems());
        Swal.fire("Removed!", "Item has been removed.", "success");
      }
    });
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    updateCartQuantity(id, quantity);
    setCartItems(getCartItems());
  };

  const handleIncrement = (id: string) => {
    const product = cartItems.find((item) => item._id === id);
    if (product) handleQuantityChange(id, product.stock + 1);
  };

  const handleDecrement = (id: string) => {
    const product = cartItems.find((item) => item._id === id);
    if (product && product.stock > 1) handleQuantityChange(id, product.stock - 1);
  };

  const calculatedTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.stock, 0);
  };

  const router = useRouter();

  const handleProceed = () => {
    Swal.fire({
      title: "Proceed to Checkout",
      text: "Please review your cart before checkout.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Success", "Your order has been confirmed!", "success");
        router.push("/checkout")
        setCartItems([]);
      }
    });
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-lg text-center">Your cart is empty.</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex flex-col md:flex-row items-center justify-between border-b pb-4">
                {/* Product Image & Details */}
                <div className="flex items-center gap-4">
                    {item.productImage && (
                  <Image
                   src={urlFor(item.productImage).url()} 
                   alt={item.title}
                   width={80} 
                   height={80}
                   className="rounded-lg" />
                )}
                  <div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="text-gray-500">${item.price}</p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecrement(item._id)}
                    className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-lg font-semibold px-3">{item.stock}</span>
                  <button
                    onClick={() => handleIncrement(item._id)}
                    className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Remove Button */}
                <button onClick={() => handleRemove(item._id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {/* Total & Checkout */}
          <div className="mt-6 text-right">
            <h2 className="text-xl font-semibold">Total: ${calculatedTotal()}</h2>
            <button
              onClick={handleProceed}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* Continue Shopping */}
      <div className="mt-6 text-center">
        <Link href="/">
          <span className="text-blue-600 hover:underline">Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};


      //   <>
      //       <div>
      //   <Image
      //     src={"/images/cart-img.png"}
      //     alt="cart-section"
      //     width={1440}
      //     height={316}
      //     className="w-full h-auto mt-20"
      //   />
      // </div>
      //       <div className="flex flex-col lg:flex-row lg:h-[525px] items-center lg:justify-around">
      //           <div className="flex flex-col w-full lg:w-auto">
      //               <nav className="h-[55px] w-full lg:w-[817px] bg-[#F9F1E7] flex items-center justify-around list-none text-sm lg:text-base">
      //                   <li>Product</li>
      //                   <li>Price</li>
      //                   <li>Quantity</li>
      //                   <li>Subtotal</li>
      //               </nav>
      //               <div className="mt-6 lg:mt-14 flex items-center justify-around flex-wrap gap-4">
      //                   <Image
      //                       src={"/images/sofas.png"}
      //                       alt="sofas"
      //                       width={108}
      //                       height={105}
      //                       className="w-[72px] lg:w-[108px] h-auto"
      //                   />
      //                   <span className="text-sm lg:text-base">Asgaard sofa</span>
      //                   <span className="text-sm lg:text-base">Rs. 250,000.00</span>
      //                   <div className="h-[32px] w-[32px] rounded-md border border-black flex items-center justify-center">
      //                       1
      //                   </div>
      //                   <span className="text-sm lg:text-base">Rs. 250,000.00</span>
      //                   <Image
      //                       src={"/images/delete.png"}
      //                       alt="delete"
      //                       width={28}
      //                       height={28}
      //                       className="w-[20px] lg:w-[28px] h-auto"
      //                   />
      //               </div>
      //           </div>
      //           <div className="bg-[#F9F1E7] w-full lg:w-[393px] h-auto lg:h-[390px] mt-8 lg:mt-0 p-6 rounded-lg flex flex-col items-center justify-center">
      //               <h1 className="text-center text-[24px] lg:text-[32px] font-semibold mb-6">
      //                   Cart Totals
      //               </h1>
      //               <div className="flex items-center justify-between mb-4 w-full px-4 lg:px-0">
      //                   <h3 className="text-sm lg:text-base">Subtotal</h3>
      //                   <span className="text-sm lg:text-base">Rs. 250,000.00</span>
      //               </div>
      //               <div className="flex items-center justify-between mb-6 w-full px-4 lg:px-0">
      //                   <h3 className="text-sm lg:text-base">Total</h3>
      //                   <span className="text-sm lg:text-base text-[#B88E2F]">Rs. 250,000.00</span>
      //               </div>
      //               <Link href={"/checkout"}>
      //                   <button className="border border-black w-full lg:w-[222px] h-[48px] lg:h-[58.95px] rounded-2xl text-[18px] lg:text-[20px]">
      //                       Check Out
      //                   </button>
      //               </Link>
      //           </div>
        
      //       </div>

      //   </>



export default CartPage


