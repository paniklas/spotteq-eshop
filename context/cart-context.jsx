"use client"

import CartDrawer from "@/components/shop/cart-drawer"

export const CartProvider = ({ children }) => {
    return (
        <>
            {children}
            <CartDrawer />
        </>
    )
}
