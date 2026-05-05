"use client"

import { createContext, useContext, useRef, useState } from "react"
import CartDrawer from "@/components/shop/cart-drawer"

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
    const [cartOpen, setCartOpen] = useState(false)
    const [cartItems, setCartItems] = useState([
        {
            id: "hyperfuel-orange",
            name: "Hyperfuel®",
            subtitle: ["Advanced Intra-Workout", "All-in-One Performance Formula"],
            price: 40,
            image: "/images/products/group-87.png",
            flavour: "Orange",
            qty: 1,
            cartId: 1,
        },
    ])
    const cartIdRef = useRef(1)

    const addToCart = (item, qty = 1) => {
        setCartItems((prev) => {
            const existing = prev.find(
                (i) => i.id === item.id && i.flavour === item.flavour
            )
            if (existing) {
                return prev.map((i) =>
                    i.cartId === existing.cartId ? { ...i, qty: i.qty + qty } : i
                )
            }
            return [...prev, { ...item, qty, cartId: ++cartIdRef.current }]
        })
        setCartOpen(true)
    }

    const removeFromCart = (cartId) =>
        setCartItems((prev) => prev.filter((i) => i.cartId !== cartId))

    const updateQty = (cartId, delta) =>
        setCartItems((prev) =>
            prev
                .map((i) => i.cartId === cartId ? { ...i, qty: i.qty + delta } : i)
                .filter((i) => i.qty > 0)
        )

    return (
        <CartContext.Provider value={{ cartOpen, setCartOpen, cartItems, addToCart, removeFromCart, updateQty }}>
            {children}
            <CartDrawer
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                items={cartItems}
                onRemove={removeFromCart}
                onUpdateQty={updateQty}
            />
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)
