"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { checkProductInventory, checkBundleInventory, checkBundleVariantInventory } from "@/app/actions/cart"

const fetchInventory = (item) => {
    if (item.type !== "bundle") return checkProductInventory(item.id)
    // A bundle's stock depends on the chosen variants, not the admin defaults.
    // Fall back to the default-based check for legacy lines with no selection.
    const sel = item.selectedFlavours ?? []
    if (sel.length) {
        return checkBundleVariantInventory(sel.map((s) => ({ productId: s.variantId, quantity: s.quantity })))
    }
    return checkBundleInventory(item.id)
}

// A stable key that makes two otherwise-identical bundles distinct cart lines when
// their chosen flavours differ. Order follows slot order, so it is deterministic.
export const bundleVariantKey = (selectedFlavours) =>
    (selectedFlavours ?? []).map((s) => s.variantId).filter(Boolean).join(",")

// Product cart id is just its _id (each flavour is a separate product doc). Bundles
// append the variant key so different flavour selections do not collapse into one line.
export const makeCartId = (id, variantKey = "") => (variantKey ? `${id}::${variantKey}` : id)

export const useCartStore = create(
    persist(
        (set, get) => ({
            cartItems: [],
            cartOpen: false,
            addingIds: {},

            addToCart: async (item, qty = 1) => {
                const variantKey = item.type === "bundle" ? bundleVariantKey(item.selectedFlavours) : ""
                const cartId = makeCartId(item.id, variantKey)

                set((state) => ({ addingIds: { ...state.addingIds, [cartId]: true } }))

                try {
                    const existing = get().cartItems.find((i) => i.cartId === cartId)
                    const currentQty = existing?.qty ?? 0

                    // Skip Sanity call if item is already in cart as unlimited (inventory: null).
                    // For limited items always fetch fresh to prevent overselling on stale data.
                    const inventory = (existing && existing.inventory === null)
                        ? null
                        : await fetchInventory(item)

                    if (inventory !== null && currentQty + qty > inventory) {
                        set((state) => {
                            const next = { ...state.addingIds }
                            delete next[cartId]
                            return { addingIds: next }
                        })
                        return { error: inventory <= 0 ? "out_of_stock" : "max_quantity" }
                    }

                    set((state) => {
                        const existing = state.cartItems.find((i) => i.cartId === cartId)
                        const next = { ...state.addingIds }
                        delete next[cartId]

                        if (existing) {
                            return {
                                cartItems: state.cartItems.map((i) =>
                                    i.cartId === cartId
                                        ? { ...i, qty: i.qty + qty, inventory: inventory ?? i.inventory }
                                        : i
                                ),
                                cartOpen: true,
                                addingIds: next,
                            }
                        }

                        return {
                            cartItems: [...state.cartItems, { ...item, qty, cartId, inventory: inventory ?? null }],
                            cartOpen: true,
                            addingIds: next,
                        }
                    })

                    return { error: null }
                } catch {
                    set((state) => {
                        const next = { ...state.addingIds }
                        delete next[cartId]
                        return { addingIds: next }
                    })
                    return { error: "failed" }
                }
            },

            removeFromCart: (cartId) =>
                set((state) => ({
                    cartItems: state.cartItems.filter((i) => i.cartId !== cartId),
                })),

            updateQty: async (cartId, delta) => {
                if (delta < 0) {
                    set((state) => ({
                        cartItems: state.cartItems
                            .map((i) => (i.cartId === cartId ? { ...i, qty: i.qty + delta } : i))
                            .filter((i) => i.qty > 0),
                    }))
                    return { error: null }
                }

                const item = get().cartItems.find((i) => i.cartId === cartId)
                if (!item) return { error: null }

                if (item.inventory !== null && item.inventory !== undefined && item.qty >= item.inventory) {
                    return { error: "max_quantity" }
                }

                // Unlimited item — increment without any Sanity call
                if (item.inventory === null) {
                    set((state) => ({
                        cartItems: state.cartItems.map((i) =>
                            i.cartId === cartId ? { ...i, qty: i.qty + 1 } : i
                        ),
                    }))
                    return { error: null }
                }

                try {
                    const freshInventory = await fetchInventory(item)

                    if (freshInventory !== null && item.qty >= freshInventory) {
                        set((state) => ({
                            cartItems: state.cartItems.map((i) =>
                                i.cartId === cartId ? { ...i, inventory: freshInventory } : i
                            ),
                        }))
                        return { error: "max_quantity" }
                    }

                    set((state) => ({
                        cartItems: state.cartItems.map((i) =>
                            i.cartId === cartId
                                ? { ...i, qty: i.qty + 1, inventory: freshInventory ?? i.inventory }
                                : i
                        ),
                    }))
                } catch {
                    set((state) => ({
                        cartItems: state.cartItems.map((i) =>
                            i.cartId === cartId ? { ...i, qty: i.qty + 1 } : i
                        ),
                    }))
                }

                return { error: null }
            },

            appliedCoupon: null,
            couponDiscount: 0,
            couponEmailVerified: false,
            checkoutEmail: "",
            selectedShippingMethod: null,

            // True once the payment step is open. The Payment Intent is created with a
            // fixed amount, so the coupon can no longer change the total — the summary
            // would show a discount the customer is not charged. Never persisted.
            paymentLocked: false,
            setPaymentLocked: (locked) => set({ paymentLocked: locked }),

            applyCoupon: (coupon, emailVerified = false) => set({
                appliedCoupon: coupon,
                couponDiscount: coupon.discountAmount,
                couponEmailVerified: emailVerified,
            }),

            removeCoupon: () => set({
                appliedCoupon: null,
                couponDiscount: 0,
                couponEmailVerified: false,
            }),

            setCheckoutEmail: (email) => set({ checkoutEmail: email }),

            setSelectedShippingMethod: (method) => set({ selectedShippingMethod: method }),

            clearCart: () => set({
                cartItems: [],
                appliedCoupon: null,
                couponDiscount: 0,
                couponEmailVerified: false,
                checkoutEmail: "",
                selectedShippingMethod: null,
                paymentLocked: false,
            }),

            setCartOpen: (open) => set({ cartOpen: open }),
            openCart: () => set({ cartOpen: true }),
            closeCart: () => set({ cartOpen: false }),
        }),
        {
            name: "spotteq-cart-v2",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ cartItems: state.cartItems }),
        }
    )
)
