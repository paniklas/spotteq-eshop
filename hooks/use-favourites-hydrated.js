"use client"

import { useSyncExternalStore } from "react"
import { useFavouritesStore } from "@/store/favourites-store"

// Favourites persist to localStorage, so they read as empty on the server and
// through the hydration render. Components that branch on favourite state must
// wait for this, otherwise a filled heart would mismatch the server's empty one.
//
// useSyncExternalStore (rather than a useEffect flag): its server snapshot keeps
// the hydration render matching the server markup, and it avoids the
// react-hooks/set-state-in-effect lint. Mirrors use-cart-hydrated.
const subscribe = (onStoreChange) => useFavouritesStore.persist.onFinishHydration(onStoreChange)
const getSnapshot = () => useFavouritesStore.persist.hasHydrated()
const getServerSnapshot = () => false

export function useFavouritesHydrated() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
