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

  const increaseQty = (product) => {
    const updatedCart = cartItems.map((x) =>
      x._id === product._id ? { ...x, qty: x.qty + 1 } : x
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const decreaseQty = (product) => {
    let updatedCart = cartItems
        .map((x) =>
        x._id === product._id ? { ...x, qty: x.qty - 1 } : x
        )
        .filter((x) => x.qty > 0); // remove item if qty <= 0

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    };
    
  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, increaseQty, decreaseQty }}
    >
      {children}
    </CartContext.Provider>
  );
}
