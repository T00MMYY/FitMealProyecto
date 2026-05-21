/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const CartContext = createContext();
const LEGACY_CART_KEY = 'fitmeal_cart';

function readCart(cartStorageKey) {
  try {
    const saved = localStorage.getItem(cartStorageKey);
    if (saved) {
      return JSON.parse(saved);
    }

    if (cartStorageKey === 'fitmeal_cart_guest') {
      const legacyCart = localStorage.getItem(LEGACY_CART_KEY);
      return legacyCart ? JSON.parse(legacyCart) : [];
    }
  } catch {
    return [];
  }

  return [];
}

export function CartProvider({ cartOwner = 'guest', children }) {
  const cartStorageKey = `fitmeal_cart_${cartOwner}`;
  const prevKeyRef = useRef(cartStorageKey);

  // Carga el carrito guardado en localStorage al arrancar
  const [cartItems, setCartItems] = useState(() => readCart(cartStorageKey));

  // Cuando el usuario hace login, migra el carrito guest al carrito del usuario
  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== cartStorageKey) {
      if (prevKey === 'fitmeal_cart_guest') {
        const guestCart = readCart(prevKey);
        if (guestCart.length > 0) {
          setCartItems((prev) => {
            const merged = [...prev];
            for (const guestItem of guestCart) {
              const exists = merged.find((p) => p.id === guestItem.id && p.formato === guestItem.formato);
              if (exists) {
                exists.cantidad += guestItem.cantidad;
              } else {
                merged.push(guestItem);
              }
            }
            return merged;
          });
          localStorage.removeItem(prevKey);
        }
      }
      prevKeyRef.current = cartStorageKey;
    }
  }, [cartStorageKey]);

  // Guarda el carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));

    if (cartStorageKey === 'fitmeal_cart_guest') {
      localStorage.removeItem(LEGACY_CART_KEY);
    }
  }, [cartItems, cartStorageKey]);

  // Añade un producto al carrito.
  // Si ya existe (mismo id y talla), suma la cantidad en vez de duplicarlo.
  const addToCart = (item) => {
    setCartItems((prev) => {
      const yaExiste = prev.find((p) => p.id === item.id && p.formato === item.formato);

      if (!yaExiste) {
        return [...prev, item];
      }

      return prev.map((p) =>
        p.id === item.id && p.formato === item.formato
          ? { ...p, cantidad: p.cantidad + item.cantidad }
          : p
      );
    });
  };

  // Cambia la cantidad de un producto (mínimo 1)
  const updateCartItemQuantity = (id, formato, cantidad) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.formato === formato
          ? { ...item, cantidad: Math.max(1, cantidad) }
          : item
      )
    );
  };

  // Elimina un producto del carrito por id y formato
  const removeFromCart = (id, formato) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === id && item.formato === formato)));
  };

  // Vacía el carrito entero
  const clearCart = () => setCartItems([]);

  // Total de unidades en el carrito
  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + (item.cantidad || 0), 0),
    [cartItems]
  );

  // Precio total del carrito
  const cartSubtotal = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.precio) * Number(item.cantidad), 0),
    [cartItems]
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateCartItemQuantity, removeFromCart, clearCart, cartCount, cartSubtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
