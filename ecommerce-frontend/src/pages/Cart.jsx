import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty } =
    useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">Shopping Cart</h2>
        <p className="text-neutral-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-neutral-600 mb-4">Your cart is empty</p>
          <button onClick={() => navigate("/products")} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="card p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-neutral-600">${item.price} each</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-sm text-neutral-500 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => decreaseQty(item)} 
                        className="w-8 h-8 flex items-center justify-center border border-neutral-300 rounded hover:bg-neutral-50"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">{item.qty}</span>
                      <button 
                        onClick={() => increaseQty(item)} 
                        className="w-8 h-8 flex items-center justify-center border border-neutral-300 rounded hover:bg-neutral-50"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-neutral-900">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-neutral-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-semibold text-neutral-900">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/placeorder")}
                className="btn btn-primary w-full py-3"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
