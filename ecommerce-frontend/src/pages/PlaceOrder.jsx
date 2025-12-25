import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function PlaceOrder() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

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

      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">Review Order</h2>
        <p className="text-neutral-600">Confirm your purchase</p>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-neutral-600 mb-4">Your cart is empty</p>
          <button onClick={() => navigate("/products")} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-2 border-b border-neutral-100 last:border-0">
                  <div>
                    <p className="font-medium text-neutral-900">{item.name}</p>
                    <p className="text-sm text-neutral-600">Qty: {item.qty}</p>
                  </div>
                  <p className="font-semibold text-neutral-900">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-neutral-200 pt-2 mt-2">
                <div className="flex justify-between text-xl font-semibold text-neutral-900">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">{error}</div>}

          <button 
            onClick={handlePlaceOrder} 
            disabled={loading}
            className="btn btn-primary w-full py-3 text-lg"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}

export default PlaceOrder;
