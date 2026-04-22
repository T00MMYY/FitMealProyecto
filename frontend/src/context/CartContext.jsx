/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fitmeal_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('fitmeal_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.id === item.id && p.talla === item.talla
      );

      if (existingIndex === -1) {
        return [...prev, item];
      }

      const next = [...prev];
      next[existingIndex] = {
        ...next[existingIndex],
        cantidad: next[existingIndex].cantidad + item.cantidad,
      };
      return next;
    });
  };

  const updateCartItemQuantity = (id, talla, cantidad) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id && item.talla === talla) {
          return {
            ...item,
            cantidad: Math.max(1, cantidad),
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id, talla) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.talla === talla)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(
    () => cartItems.reduce((acc, item) => acc + (item.cantidad || 0), 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((acc, item) => acc + Number(item.precio) * Number(item.cantidad), 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
