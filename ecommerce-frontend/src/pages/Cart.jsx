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
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div>
            {cartItems.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              >
                <div>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: "80px" }}
                  />
                  <span>{item.name}</span>
                </div>
                <div>
                  <button onClick={() => increaseQty(item)}>+</button>
                  <span style={{ margin: "0 10px" }}>{item.qty}</span>
                  <button onClick={() => decreaseQty(item)}>-</button>
                  <button onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
                <div>${item.price * item.qty}</div>
              </div>
            ))}
          </div>

          <h3>Total: ${totalPrice}</h3>

          <button
            onClick={() => navigate("/placeorder")}
            disabled={cartItems.length === 0}
          >
            Proceed to Place Order
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
