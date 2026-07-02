"use client";

// App-wide wishlist state, backed by Firestore and kept live with onSnapshot.
// Reads the current user from useAuth; when signed out, the wishlist is empty.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  addToWishlist,
  removeFromWishlist,
  subscribeWishlist,
} from "@/services/users";

interface WishlistContextValue {
  ids: string[];
  isSaved: (hotelId: string) => boolean;
  toggle: (hotelId: string) => void;
}

const WishlistContext = createContext<WishlistContextValue>({
  ids: [],
  isSaved: () => false,
  toggle: () => {},
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    // Live subscription — local state stays in sync with Firestore.
    // State is reset in cleanup (on sign-out / user change), not synchronously.
    const unsubscribe = subscribeWishlist(user.uid, setIds);
    return () => {
      unsubscribe();
      setIds([]);
    };
  }, [user]);

  function isSaved(hotelId: string) {
    return ids.includes(hotelId);
  }

  function toggle(hotelId: string) {
    if (!user) return;
    // onSnapshot will push the updated list back to us.
    if (ids.includes(hotelId)) {
      void removeFromWishlist(user.uid, hotelId);
    } else {
      void addToWishlist(user.uid, hotelId);
    }
  }

  return (
    <WishlistContext.Provider value={{ ids, isSaved, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  return useContext(WishlistContext);
}
