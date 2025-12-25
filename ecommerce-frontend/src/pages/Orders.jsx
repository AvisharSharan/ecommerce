import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Orders() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return navigate("/login");

    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/api/orders/myorders");
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) return <p className="text-neutral-600 text-center py-12">Loading orders...</p>;
  if (error) return <p className="text-red-600 text-center py-12">{error}</p>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">My Orders</h2>
        <p className="text-neutral-600">Track and manage your orders</p>
      </div>
      
      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-neutral-600 mb-4">You have no orders yet</p>
          <button onClick={() => navigate("/products")} className="btn btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Order #{order._id}</p>
                  <p className="text-xs text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <span className="badge">{order.status}</span>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-sm text-neutral-600">
                  {order.orderItems?.length || 0} {order.orderItems?.length === 1 ? 'item' : 'items'}
                </div>
                <p className="text-xl font-semibold text-neutral-900">${order.totalPrice}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
