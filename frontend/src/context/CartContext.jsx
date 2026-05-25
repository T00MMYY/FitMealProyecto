/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const CartContext = createContext();
const CLAVE_CARRITO_ANTIGUO = 'fitmeal_cart';

function leerCarritoDeStorage(claveStorage) {
  try {
    const carritoGuardado = localStorage.getItem(claveStorage);
    if (carritoGuardado) {
      return JSON.parse(carritoGuardado);
    }

    if (claveStorage === 'fitmeal_cart_guest') {
      const carritoAntiguo = localStorage.getItem(CLAVE_CARRITO_ANTIGUO);
      return carritoAntiguo ? JSON.parse(carritoAntiguo) : [];
    }
  } catch {
    return [];
  }

  return [];
}

export function CartProvider({ cartOwner = 'guest', children }) {
  const claveStorage = `fitmeal_cart_${cartOwner}`;
  const claveAnteriorRef = useRef(claveStorage);

  // Carga el carrito guardado en localStorage al arrancar
  const [productosCarrito, setProductosCarrito] = useState(() => leerCarritoDeStorage(claveStorage));

  // fusionar guest con usuario
  useEffect(() => {
    const claveAnterior = claveAnteriorRef.current;
    if (claveAnterior !== claveStorage) {
      if (claveAnterior === 'fitmeal_cart_guest') {
        const carritoGuest = leerCarritoDeStorage(claveAnterior);
        if (carritoGuest.length > 0) {
          setProductosCarrito((productosActuales) => {
            const carritoFusionado = [...productosActuales];
            for (const productoGuest of carritoGuest) {
              const yaExiste = carritoFusionado.find((p) => p.id === productoGuest.id && p.formato === productoGuest.formato);
              if (yaExiste) {
                yaExiste.cantidad += productoGuest.cantidad;
              } else {
                carritoFusionado.push(productoGuest);
              }
            }
            return carritoFusionado;
          });
          localStorage.removeItem(claveAnterior);
        }
      }
      claveAnteriorRef.current = claveStorage;
    }
  }, [claveStorage]);

  // Guarda el carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem(claveStorage, JSON.stringify(productosCarrito));

    if (claveStorage === 'fitmeal_cart_guest') {
      localStorage.removeItem(CLAVE_CARRITO_ANTIGUO);
    }
  }, [productosCarrito, claveStorage]);

  // Añade un producto al carrito. Si ya existe (mismo id y talla), suma la cantidad.
  const addToCart = (productoNuevo) => {
    setProductosCarrito((productosActuales) => {
      const yaExiste = productosActuales.find((p) => p.id === productoNuevo.id && p.formato === productoNuevo.formato);

      if (!yaExiste) {
        return [...productosActuales, productoNuevo];
      }

      return productosActuales.map((producto) =>
        producto.id === productoNuevo.id && producto.formato === productoNuevo.formato
          ? { ...producto, cantidad: producto.cantidad + productoNuevo.cantidad }
          : producto
      );
    });
  };

  // Cambia la cantidad de un producto (mínimo 1)
  const updateCartItemQuantity = (idProducto, formato, nuevaCantidad) => {
    setProductosCarrito((productosActuales) =>
      productosActuales.map((producto) =>
        producto.id === idProducto && producto.formato === formato
          ? { ...producto, cantidad: Math.max(1, nuevaCantidad) }
          : producto
      )
    );
  };

  // Elimina un producto del carrito por id y formato
  const removeFromCart = (idProducto, formato) => {
    setProductosCarrito((productosActuales) => productosActuales.filter((producto) => !(producto.id === idProducto && producto.formato === formato)));
  };

  // Vacía el carrito entero
  const clearCart = () => setProductosCarrito([]);

  // Total de unidades en el carrito
  const cartCount = useMemo(
    () => productosCarrito.reduce((total, producto) => total + (producto.cantidad || 0), 0),
    [productosCarrito]
  );

  // Precio total del carrito
  const cartSubtotal = useMemo(
    () => productosCarrito.reduce((total, producto) => total + Number(producto.precio) * Number(producto.cantidad), 0),
    [productosCarrito]
  );

  return (
    <CartContext.Provider value={{ cartItems: productosCarrito, addToCart, updateCartItemQuantity, removeFromCart, clearCart, cartCount, cartSubtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
