"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Product } from '../../../types/products'
import { getCartItems } from '../actions/actions'
import { Link } from 'lucide-react'
import {CgChevronRight} from 'react-icons/cg'
import { urlFor } from '@/sanity/lib/image'
import { client } from '@/sanity/lib/client'
import Swal from 'sweetalert2'

const CheckOutPage = () => {
    const [cartItems, setCartItems] = useState<Product[]>([])
    const [discount, setDiscount] = useState<number>(0)
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        zipCode: "",
        city:"",
    })
    const [formErrors, setformErrors] = useState({
        firstName: false,
        lastName:false ,
        phone: false,
        email: false,
        address: false,
        zipCode: false,
        city: false,
    })
    useEffect (() => {
        setCartItems(getCartItems())
        const appliedDiscount = localStorage.getItem("appliedDiscount")
        if (appliedDiscount){
            setDiscount(Number(appliedDiscount))
        }
    }, [])

    const subTotal = cartItems.reduce(
        (total, item) => total + item.price * item.stock,0)
        const total = Math.max(subTotal - discount, 0)
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormValues({
                ...formValues,
                [e.target.id]: e.target.value
            })
        }
         const validateForm = () => {
            const errors ={
                firstName: !formValues.firstName,
                lastName:!formValues.lastName ,
                phone: !formValues.phone,
                email: !formValues.email.includes("@"),
                address: !formValues.address,
                zipCode: !formValues.zipCode,
                city: !formValues.city
            };
            setformErrors(errors);
            return Object.values(errors).every((error) => !error);
         }
         const handlePlaceOrder  =async  () => {

           
             Swal.fire({
                  title: "Processing your order...",
                  text: "Please wait a moment.",
                  icon: "info",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Proceed!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    if(validateForm()){
                    localStorage.removeItem("appliedDiscount");
                    Swal.fire("Success", "Your order has been confirmed!", "success");
                    } else{
                        Swal.fire(
                            "Error!",
                            "Please fill in all the feilds before proceeding.",
                            "error"
                        );
                    }
                  }
                });
            // if (ValidateForm () ){ 
            //     localStorage.removeItem("applliedDiscount")

            // }
            const orderData = {
                _type : "order",
                firstName: formValues.firstName,
                lastName: formValues.lastName,
                address: formValues.address,
                city: formValues.city,
                zipCode: formValues.zipCode,
                phone: formValues.phone,
                email: formValues.email,
                cartItems: cartItems.map((item) => ({
                    _type:"reference",
                    _ref: item._id,
                })),
                total : total,
                discount: discount,
                orderDate: new Date().toISOString
            };
            try{
                await client.create(orderData)
                localStorage.removeItem("appliedDiscount")
            }catch (error){
                console.error("error creating order",error);
                
            }
         }
        
    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='mt-6'>
                <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <nav className='flex-items-center gap-2 py-4'>
                        <Link href='/cart' className='text-[#666666] hover:text-black transition text-sm'>
                         Cart
                        </Link>
                        <CgChevronRight className='w-4 h-4 text-#666666'/>
                        <span className='text-sm'>
                            CheckOut
                        </span>
                    </nav>
                </div>
            </div>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    <div className='bg-white border rounded-lg p-6 space-y-6'>
                        <h2 className='text-lg font-semibold mb-4'>
                            Oder Summary
                        </h2>
                        {cartItems.length > 0 ? (
                        cartItems.map((item) =>(
                            <div key={item._id} className='flex items-center gap-4 py-3 border-b'>
                                <div className='w-16 h-16 rounded overflow-hidden'>
                                    {item.productImage && (
                                        <Image
                                        src={urlFor(item.productImage).url()}
                                        alt='image'
                                        width={50}
                                        height={50}
                                        className='object-cover w-full h-full'/>
                                    )}
                                </div>
                                <div className='flex-1'>
                                <h3 className='text-sm font-medium'>
                                {item.title}
                                </h3>
                                <p className='text-xs text-gray-500'>Quantity : {item.stock}</p>
                                <p>${item.price * item.stock}</p>
                                </div>

                            </div>
                        ))
                    ):(
                        <p className='text-xs font-medium'>No items in cart</p>
                    )}
                    <div className='text-right pt-4'>
                        <p className='text-sm'>
                            SubTotal: <span>${subTotal}</span>
                        </p>
                        <p className='text-sm'>
                            Discount: <span>${discount}</span>
                        </p>
                        <p className='text-lg font-semibold'>
                            Total: <span>${subTotal.toFixed(2)}</span>
                        </p>
                    </div>   
                    </div>
                    {/* Billing Form */}
          <div className="bg-white border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold">Billing Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName">First Name: </label>
                <input
                  id="firstName"
                  placeholder="Enter your first name"
                  value={formValues.firstName}
                  onChange={handleInputChange}
                  className="border"
                />
                {formErrors.firstName && (
                  <p className="text-sm text-red-500">
                    First name is required.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="lastName">Last Name: </label>
                <input
                  id="lastName"
                  placeholder="Enter your Last Name"
                  value={formValues.lastName}
                  onChange={handleInputChange}
                  className="border"
                />
                {formErrors.lastName && (
                  <p className="text-sm text-red-500">
                    Last name is required.
                  </p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="address">Address: </label>
              <input
                id="address"
                placeholder="Enter your address"
                value={formValues.address}
                onChange={handleInputChange}
                className="border"
              />
              {formErrors.address && (
                <p className="text-sm text-red-500">Address is required.</p>
              )}
            </div>
            <div>
              <label htmlFor="city">City: </label>
              <input
                id="city"
                placeholder="Enter your city"
                value={formValues.city}
                onChange={handleInputChange}
                className="border"
              />
              {formErrors.city && (
                <p className="text-sm text-red-500">City is required.</p>
              )}
            </div>
            <div>
              <label htmlFor="zipCode">Zip Code: </label>
              <input
                id="zipCode"
                placeholder="Enter your zip code"
                value={formValues.zipCode}
                onChange={handleInputChange}
                className="border"
              />
              {formErrors.zipCode && (
                <p className="text-sm text-red-500">Zip Code is required.</p>
              )}
            </div>
            <div>
              <label htmlFor="phone">Phone: </label>
              <input
                id="phone"
                placeholder="Enter your phone number"
                value={formValues.phone}
                onChange={handleInputChange}
                className="border"
              />
              {formErrors.phone && (
                <p className="text-sm text-red-500">Phone is required.</p>
              )}
            </div>
            <div>
              <label htmlFor="email">Email: </label>
              <input
                id="email"
                placeholder="Enter your email address"
                value={formValues.email}
                onChange={handleInputChange}
                className="border"
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">Email is required.</p>
              )}
            </div>
            <button
              className="w-full h-12 bg-amber-600 hover:bg-amber-800 text-white"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOutPage