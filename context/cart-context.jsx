"use client"

import CartDrawer from "@/components/shop/cart-drawer"

export const CartProvider = ({ children, allBundles = [], freeShippingThreshold = 0 }) => {
    return (
        <>
            {children}
            <CartDrawer allBundles={allBundles} freeShippingThreshold={freeShippingThreshold} />
        </>
    )
}
