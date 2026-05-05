"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/context/cart-context";

const FREE_SHIPPING_THRESHOLD = 95.50
const FLAT_SHIPPING = 4.99

const OrderSummary = () => {
    const { cartItems } = useCart()
    const [coupon, setCoupon] = useState("")

    const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subTotal)
    const shipping = subTotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING
    const total = subTotal + shipping

    return (
        <div className="bg-white-custom rounded-2xl p-6 h-full overflow-y-auto">
            <h2 className="font-aeonik text-[22px] xl:text-[35px] text-black-custom mb-6">Order Summary</h2>

            {/* Items */}
            <div className="flex flex-col">
                {cartItems.length === 0 && (
                    <p className="font-aeonik text-[14px] text-gray-text text-center py-6">Your bag is empty.</p>
                )}
                <hr className="border-black-custom mb-5" />

                {/* Free shipping banner */}
                <div className="mb-10">
                    <p className="font-aeonik text-[13px] xl:text-[22px] text-black-custom">
                        {remaining > 0
                            ? `You are ${remaining.toFixed(2).replace(".", ",")}€ away from FREE SHIPPING!`
                            : "You've unlocked FREE SHIPPING!"}
                    </p>
                </div>

                {cartItems.map((item, i) => (
                    <div key={item.cartId}>
                        {i > 0 && <hr className="border-gray-mint mb-5" />}
                        <div className="flex items-center gap-4">
                            {/* Image */}
                            <div className="relative w-20 h-24 shrink-0 flex items-center justify-center">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-375/572 bg-gray-soft rounded-full z-0" />
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    unoptimized
                                    className="w-[75%] h-[75%] object-contain relative z-1"
                                />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0 space-y-1">
                                <p className="font-aeonik text-[15px] xl:text-[24px] text-black-custom">{item.name}</p>
                                {item.subtitle?.map((line) => (
                                    <p key={line} className="font-aeonik text-[12px] xl:text-[16px] text-black-custom leading-none">{line}</p>
                                ))}
                                {item.flavour && (
                                    <p className="font-aeonik text-[12px] xl:text-[16px] text-gray-text">{item.flavour}</p>
                                )}
                                <p className="font-aeonik text-[12px] xl:text-[16px] text-gray-text mt-1">Qty: {item.qty}</p>
                            </div>

                            {/* Price */}
                            <span className="font-tt text-[16px] xl:text-[22px] text-black-custom shrink-0">
                                {(item.price * item.qty).toFixed(2).replace(".", ",")}€
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Coupon */}
            <div className="flex items-center gap-4 mt-12 mb-6">
                <span className="font-aeonik text-[11px] xl:text-[14px] uppercase text-black-custom leading-tight shrink-0">
                    COUPON CODE /<br />GIFT CARD
                </span>
                <div className="flex-1 flex items-center border border-gray-mint rounded-sm">
                    <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="flex-1 px-3 py-2.5 font-tt text-[13px] text-black-custom outline-none bg-transparent"
                    />
                    <button className="px-3 py-2.5 hover:opacity-60 transition-opacity cursor-pointer">
                        <Check size={15} strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {/* Totals */}
            <div className="mt-6 flex flex-col gap-3">
                <hr className="border-gray-mint" />

                <div className="flex justify-between items-center">
                    <span className="font-aeonik text-[13px] xl:text-[14px] uppercase tracking-wide text-black-custom">Subtotal</span>
                    <span className="font-tt text-[16px] text-black-custom">{subTotal.toFixed(2).replace(".", ",")}€</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="font-aeonik text-[13px] xl:text-[14px] uppercase tracking-wide text-black-custom">Shipping</span>
                    <span className="font-tt text-[16px] text-black-custom">
                        {shipping === 0 ? "FREE" : `${FLAT_SHIPPING.toFixed(2).replace(".", ",")}€`}
                    </span>
                </div>

                <hr className="border-gray-mint" />

                <div className="flex justify-between items-center">
                    <span className="font-aeonik text-[16px] uppercase tracking-wide text-black-custom">Total</span>
                    <span className="font-aeonik text-[30px] font-bold text-black-custom">{total.toFixed(2).replace(".", ",")}€</span>
                </div>
            </div>

            {/* Payment icons */}
            <div className="flex justify-end mt-28">
                <Image
                    src="/images/payment-icons.png"
                    alt="Accepted payment methods"
                    width={240}
                    height={32}
                    unoptimized
                    className="h-5 w-auto object-contain"
                />
            </div>

            {/* Footer links */}
            <div className="flex items-center justify-end gap-6 mt-6 flex-wrap">
                <Link href="/contact" className="font-aeonik text-[11px] xl:text-[13px] uppercase tracking-wide text-black-custom underline">
                    Contact Us
                </Link>
                <Link href="/payment-security" className="font-aeonik text-[11px] xl:text-[13px] uppercase tracking-wide text-black-custom underline">
                    Payment &amp; Security
                </Link>
                <Link href="/shipping-returns" className="font-aeonik text-[11px] xl:text-[13px] uppercase tracking-wide text-black-custom underline">
                    Shipping &amp; Returns
                </Link>
            </div>
        </div>
    )
}

export default OrderSummary
