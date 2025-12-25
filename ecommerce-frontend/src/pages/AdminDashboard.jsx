import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await api.get("/api/products");
        setProducts(productsRes.data);

        const ordersRes = await api.get("/api/orders");
        setOrders(ordersRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-neutral-600 text-center py-12">Loading admin dashboard...</p>;
  if (error) return <p className="text-red-600 text-center py-12">{error}</p>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">Admin Dashboard</h2>
        <p className="text-neutral-600">Manage products and orders</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-neutral-900">Products</h3>
            <span className="badge">{products.length} total</span>
          </div>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p._id} className="card p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-neutral-900">{p.name}</p>
                    <p className="text-sm text-neutral-600">Stock: {p.countInStock}</p>
                  </div>
                  <p className="font-semibold text-neutral-900">${p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-neutral-900">Orders</h3>
            <span className="badge">{orders.length} total</span>
          </div>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o._id} className="card p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-neutral-500">Order #{o._id.slice(-8)}</p>
                    <p className="text-sm text-neutral-600">{o.user?.name || 'Guest'}</p>
                  </div>
                  <span className="badge">{o.status}</span>
                </div>
                <p className="font-semibold text-neutral-900">${o.totalPrice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
