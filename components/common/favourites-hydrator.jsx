"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useFavouritesStore } from "@/store/favourites-store";
import { getFavouriteIds } from "@/app/actions/favourites";

// Loads the signed-in user's favourite product ids into the client store once
// Clerk resolves. Guests are cleared to an empty list. Renders nothing.
export default function FavouritesHydrator() {
    const { isLoaded, isSignedIn } = useUser();
    const setFavourites = useFavouritesStore((s) => s.setFavourites);
    const clear = useFavouritesStore((s) => s.clear);

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) {
            clear();
            return;
        }
        let active = true;
        getFavouriteIds()
            .then((ids) => {
                if (active) setFavourites(ids);
            })
            // Keep the persisted (localStorage) view on a transient failure
            // rather than clearing — avoids an unhandled rejection either way.
            .catch(() => {});
        return () => {
            active = false;
        };
    }, [isLoaded, isSignedIn, setFavourites, clear]);

    return null;
}
