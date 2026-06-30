"use client"

import CartDrawer from "@/components/shop/cart-drawer"

export const CartProvider = ({ children, allBundles = [] }) => {
    return (
        <>
            {children}
            <CartDrawer allBundles={allBundles} />
        </>
    )
}
