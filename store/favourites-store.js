"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toggleFavourite as toggleFavouriteAction } from "@/app/actions/favourites";

// Signed-in-only wishlist state. Persisted to localStorage so a refresh paints
// the filled heart immediately (no empty→filled flash) — the server fetch in
// <FavouritesHydrator/> then reconciles against the source of truth. Cleared on
// sign-out, so it never leaks between accounts on a shared device.
//
// Mirrors the cart-store pattern (persist + optimistic update + reconcile). We
// deliberately do NOT use React 19's useOptimistic: the state is global and
// shared across every product card + the account dashboard, whereas
// useOptimistic is scoped to a single component's transition.
export const useFavouritesStore = create(
    persist(
        (set, get) => ({
            ids: [],
            pending: {},

            setFavourites: (ids) => set({ ids: ids ?? [] }),

            clear: () => set({ ids: [] }),

            // Flip the heart immediately, persist server-side, roll back on failure.
            // Returns the action result so the caller can toast on error / auth prompt.
            toggleFavourite: async (id) => {
                if (!id || get().pending[id]) return { ok: false };

                const wasFav = get().ids.includes(id);

                set((s) => ({
                    ids: wasFav ? s.ids.filter((x) => x !== id) : [...s.ids, id],
                    pending: { ...s.pending, [id]: true },
                }));

                const result = await toggleFavouriteAction(id);

                set((s) => {
                    const pending = { ...s.pending };
                    delete pending[id];
                    if (!result.ok) {
                        // Restore the pre-click state.
                        const ids = wasFav
                            ? (s.ids.includes(id) ? s.ids : [...s.ids, id])
                            : s.ids.filter((x) => x !== id);
                        return { ids, pending };
                    }
                    return { pending };
                });

                return result;
            },
        }),
        {
            name: "spotteq-favourites-v1",
            storage: createJSONStorage(() => localStorage),
            // Only the ids are worth persisting — `pending` is transient per session.
            partialize: (s) => ({ ids: s.ids }),
        }
    )
);
