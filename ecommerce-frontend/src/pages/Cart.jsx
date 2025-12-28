import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, clearCart } =
    useContext(CartContext);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h2>
        <p className="text-gray-600">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button onClick={() => navigate("/products")} className="btn btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map((item) => (
              <div key={item._id} className="card p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600">${item.price} each</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => decreaseQty(item)} 
                        className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-pill hover:bg-primary-50 hover:border-primary-500 hover:text-primary-600 transition-all font-semibold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">{item.qty}</span>
                      <button 
                        onClick={() => increaseQty(item)} 
                        className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-pill hover:bg-primary-50 hover:border-primary-500 hover:text-primary-600 transition-all font-semibold"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold text-gray-900">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-primary-600">Free</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/placeorder")}
                className="btn btn-primary w-full mb-3"
              >
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="btn btn-secondary w-full text-sm"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
