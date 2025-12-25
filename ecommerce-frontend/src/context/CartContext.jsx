import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );

  const addToCart = (product) => {
    const exist = cartItems.find((x) => x._id === product._id);
    let updatedCart;
    if (exist) {
      updatedCart = cartItems.map((x) =>
        x._id === product._id ? { ...x, qty: x.qty + 1 } : x
      );
    } else {
      updatedCart = [...cartItems, { ...product, qty: 1 }];
    }
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((x) => x._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
