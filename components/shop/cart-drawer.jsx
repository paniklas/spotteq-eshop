"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Check, X } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { useCartStore } from "@/store/cart-store"
import { validateCoupon } from "@/app/actions/coupon"


const FREE_SHIPPING_THRESHOLD = 95.50

const CheckoutModal = ({ onClose, onCloseAll, onGuest }) => (
    <>
        <div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        />
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
            <div className="bg-white-custom rounded-2xl p-8 w-full max-w-md shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-aeonik text-[22px] text-black-custom">Before you continue</h3>
                    <button onClick={onClose} aria-label="Close" className="p-1 hover:opacity-60 transition-opacity cursor-pointer">
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>
                <p className="font-aeonik text-[14px] text-gray-text mb-8 leading-relaxed">
                    Sign in or create a free account to track your orders, save your details, and enjoy a faster checkout next time.
                </p>
                <div className="flex flex-col gap-3">
                    <Link
                        href="/login"
                        onClick={onCloseAll}
                        className="w-full h-14 bg-black-custom font-aeonik text-[13px] xl:text-[15px] uppercase text-white-custom rounded-[18px] hover:bg-gray-text transition-colors duration-300 flex items-center justify-center"
                    >
                        Sign in / Create account
                    </Link>
                    <button
                        onClick={onGuest}
                        className="w-full h-14 border border-black-custom font-aeonik text-[13px] xl:text-[15px] uppercase text-black-custom rounded-[18px] hover:bg-gray-soft transition-colors duration-300 cursor-pointer"
                    >
                        Continue as guest
                    </button>
                </div>
            </div>
        </div>
    </>
)

const CartDrawer = () => {
    const { cartItems, cartOpen, closeCart, removeFromCart, updateQty, appliedCoupon, couponDiscount, applyCoupon, removeCoupon } = useCartStore()
    const [couponInput, setCouponInput] = useState("")
    const [couponApplying, setCouponApplying] = useState(false)
    const [couponError, setCouponError] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [incrementingIds, setIncrementingIds] = useState({})
    const router = useRouter()

    const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0)
    const discountAmount = couponDiscount > 0 ? (subTotal * couponDiscount) / 100 : 0
    const total = subTotal - discountAmount
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subTotal)

    const handleApplyCoupon = async () => {
        setCouponError("")
        setCouponApplying(true)
        const result = await validateCoupon(couponInput)
        setCouponApplying(false)
        if (!result.valid) {
            setCouponError(result.error)
            return
        }
        applyCoupon(result.coupon)
        setCouponInput("")
    }

    const handleRemoveCoupon = () => {
        removeCoupon()
        setCouponInput("")
        setCouponError("")
    }

    const handleCheckoutClick = () => setShowModal(true)
    const handleModalClose = () => setShowModal(false)
    const handleCloseAll = () => { setShowModal(false); closeCart() }
    const handleGuest = () => { setShowModal(false); closeCart(); router.push("/checkout") }
    const handleDrawerClose = () => { setShowModal(false); closeCart() }

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={handleDrawerClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-200 bg-white flex flex-col transform transition-transform duration-500 ease-in-out ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="px-8 pt-8 pb-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-3">
                            <h2 className="font-aeonik text-[28px] xl:text-[35px] text-black-custom">Your bag</h2>
                            <span className="font-aeonik text-[13px] xl:text-[18px] text-black-custom underline">
                                {cartItems.length} {cartItems.length === 1 ? "ITEM" : "ITEMS"}
                            </span>
                        </div>
                        <button onClick={handleDrawerClose} className="p-1 hover:opacity-60 transition-opacity duration-200 cursor-pointer">
                            <Image src="/icons/X.svg" alt="Close" width={20} height={20} />
                        </button>
                    </div>
                    <hr className="border-black-custom mt-5" />
                </div>

                {/* Free shipping banner */}
                <div className="px-8 pt-4 pb-4">
                    <p className="font-aeonik text-[13px] xl:text-[22px] text-black-custom">
                        {remaining > 0
                            ? `You are ${remaining.toFixed(2).replace(".", ",")}€ away from FREE SHIPPING!`
                            : "You've unlocked FREE SHIPPING!"}
                    </p>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-8">
                    {cartItems.length === 0 && (
                        <p className="font-aeonik text-[14px] xl:text-[22px] text-gray-text text-center mt-12">Your bag is empty.</p>
                    )}
                    {cartItems.map((item, i) => (
                        <div key={item.cartId}>
                            {i > 0 && <hr className="border-gray-mint" />}
                            <div className="flex gap-4 py-8 pb-4">
                                {/* Image + name — clickable if slug is available */}
                                <Link
                                    href={item.slug ? (item.type === "bundle" ? `/shop/bundle/${item.slug}` : `/shop/product/${item.slug}`) : "#"}
                                    onClick={item.slug ? closeCart : undefined}
                                    className="relative w-24 h-28 shrink-0 flex items-center justify-center"
                                >
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-375/572 bg-gray-soft rounded-full z-0" />
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={80}
                                        height={80}
                                        unoptimized
                                        className="w-[75%] h-[75%] object-contain relative z-1"
                                    />
                                </Link>

                                {/* Name left — price + qty + remove stacked on the right */}
                                <div className="flex-1 flex justify-between items-start gap-4">
                                    <div>
                                        <Link
                                            href={item.slug ? (item.type === "bundle" ? `/shop/bundle/${item.slug}` : `/shop/product/${item.slug}`) : "#"}
                                            onClick={item.slug ? closeCart : undefined}
                                            className="font-aeonik text-[15px] xl:text-[24px] text-black-custom hover:underline"
                                        >
                                            {item.name}
                                        </Link>
                                        {item.subtitle?.map((line, i) => (
                                            <p key={i} className="font-aeonik text-[12px] xl:text-[16px] text-black-custom leading-snug">{line}</p>
                                        ))}
                                        {item.flavour && (
                                            <p className="font-aeonik text-[12px] xl:text-[16px] text-gray-text">{item.flavour}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-6 shrink-0">
                                        <span className="font-tt text-[15px] xl:text-[22px] text-black-custom">{item.price}€</span>
                                        <div className="flex items-center border border-black-custom rounded-full px-1">
                                            <button
                                                onClick={() => updateQty(item.cartId, -1)}
                                                className="w-7 h-7 flex items-center justify-center text-black-custom hover:opacity-60 transition-opacity cursor-pointer font-tt text-[18px]"
                                            >
                                                −
                                            </button>
                                            <span className="w-6 text-center font-aeonik text-[14px] text-black-custom">{item.qty}</span>
                                            <button
                                                disabled={!!incrementingIds[item.cartId] || (item.inventory != null && item.qty >= item.inventory)}
                                                onClick={async () => {
                                                    setIncrementingIds((prev) => ({ ...prev, [item.cartId]: true }))
                                                    await updateQty(item.cartId, 1)
                                                    setIncrementingIds((prev) => {
                                                        const next = { ...prev }
                                                        delete next[item.cartId]
                                                        return next
                                                    })
                                                }}
                                                className="w-7 h-7 flex items-center justify-center text-black-custom hover:opacity-60 transition-opacity cursor-pointer font-tt text-[18px] disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.cartId)}
                                            className="flex items-center gap-1.5 font-aeonik text-[11px] xl:text-[14px] uppercase tracking-wide text-black-custom hover:opacity-60 transition-opacity cursor-pointer"
                                        >
                                            REMOVE
                                            <Trash2 size={16} strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 pt-5 border-t border-gray-mint">
                    {/* Coupon */}
                    {appliedCoupon ? (
                        <div className="flex items-center justify-between mb-6 px-3 py-2.5 bg-teal-accent/10 border border-teal-accent rounded-sm">
                            <span className="font-aeonik text-[13px] text-black-custom">
                                <span className="font-semibold">{appliedCoupon.couponCode}</span>
                                {" — "}{appliedCoupon.discountAmount}% off
                            </span>
                            <button onClick={handleRemoveCoupon} className="p-1 hover:opacity-60 transition-opacity cursor-pointer">
                                <X size={14} strokeWidth={1.5} />
                            </button>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <div className="flex items-center gap-4">
                                <span className="font-aeonik text-[11px] xl:text-[14px] uppercase text-black-custom leading-tight shrink-0">
                                    COUPON CODE /<br />GIFT CARD
                                </span>
                                <div className="flex-1 flex items-center border border-gray-mint rounded-sm">
                                    <input
                                        value={couponInput}
                                        onChange={(e) => { setCouponInput(e.target.value); setCouponError("") }}
                                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                                        placeholder="Enter code"
                                        className="flex-1 px-3 py-2.5 font-tt text-[13px] text-black-custom outline-none bg-transparent placeholder:text-gray-text/50"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={couponApplying}
                                        className="px-3 py-2.5 hover:opacity-60 transition-opacity cursor-pointer disabled:opacity-40 flex items-center gap-1 font-aeonik text-[11px] xl:text-[13px] uppercase shrink-0"
                                    >
                                        <Check size={13} strokeWidth={1.5} />
                                        {couponApplying ? "..." : "Apply"}
                                    </button>
                                </div>
                            </div>
                            {couponError && (
                                <p className="mt-1.5 font-aeonik text-[11px] text-red-500">{couponError}</p>
                            )}
                        </div>
                    )}

                    {/* Total */}
                    <div className="flex flex-col gap-1 mb-5">
                        {discountAmount > 0 && (
                            <>
                                <div className="flex items-center justify-between">
                                    <span className="font-aeonik text-[13px] xl:text-[14px] uppercase text-black-custom">SUBTOTAL</span>
                                    <span className="font-aeonik text-[16px] text-black-custom">{subTotal.toFixed(2).replace(".", ",")}€</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-aeonik text-[13px] xl:text-[14px] uppercase text-teal-accent">DISCOUNT ({appliedCoupon.discountAmount}%)</span>
                                    <span className="font-aeonik text-[16px] text-teal-accent">-{discountAmount.toFixed(2).replace(".", ",")}€</span>
                                </div>
                            </>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="font-aeonik text-[13px] xl:text-[14px] uppercase text-black-custom">TOTAL</span>
                            <span className="font-aeonik text-[30px] font-bold text-black-custom">{total.toFixed(2).replace(".", ",")}€</span>
                        </div>
                    </div>

                    {/* Checkout */}
                    <button
                        onClick={handleCheckoutClick}
                        className="w-full h-14 bg-black-custom font-aeonik text-[13px] xl:text-[16px] uppercase text-white-custom rounded-[18px] hover:bg-gray-text transition-colors duration-300 cursor-pointer flex items-center justify-center"
                    >
                        PROCEED TO CHECKOUT
                    </button>
                </div>
            </div>

            {/* Guest / Account modal */}
            {showModal && (
                <CheckoutModal
                    onClose={handleModalClose}
                    onCloseAll={handleCloseAll}
                    onGuest={handleGuest}
                />
            )}
        </>
    )
}

export default CartDrawer
