import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function PlaceOrder() {
  const { cartItems, setCartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePlaceOrder = async () => {
    if (!user) return navigate("/login");

    setLoading(true);
    try {
      const { data } = await api.post("/api/orders", {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image,
        })),
        totalPrice,
      });

      setCartItems([]);
      localStorage.removeItem("cartItems");

      navigate(`/orders/${data._id}`); // go to order details
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Place Order</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id}>
                {item.name} x {item.qty} = ${item.price * item.qty}
              </li>
            ))}
          </ul>
          <h3>Total: ${totalPrice}</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button onClick={handlePlaceOrder} disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}

export default PlaceOrder;
