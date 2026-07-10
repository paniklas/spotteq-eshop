"use client"

import { useSyncExternalStore } from "react"
import { useCartStore } from "@/store/cart-store"

// The cart lives in localStorage, so it reads as empty on the server and through the
// hydration render. Components that branch on cart contents must wait for this,
// otherwise a customer with a full cart sees an empty-cart state on every load.
//
// useSyncExternalStore rather than a useEffect-set flag: its server snapshot keeps
// the hydration render matching the server markup, and it does not trip
// react-hooks/set-state-in-effect.
const subscribe = (onStoreChange) => useCartStore.persist.onFinishHydration(onStoreChange)
const getSnapshot = () => useCartStore.persist.hasHydrated()
const getServerSnapshot = () => false

export function useCartHydrated() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
