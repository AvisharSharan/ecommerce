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

  if (loading) return <p>Loading admin dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Products</h3>
      <ul>
        {products.map((p) => (
          <li key={p._id}>
            {p.name} - ${p.price} | Stock: {p.countInStock}
          </li>
        ))}
      </ul>

      <h3>Orders</h3>
      <ul>
        {orders.map((o) => (
          <li key={o._id}>
            Order ID: {o._id} | User: {o.user?.name} | Total: ${o.totalPrice} | Status: {o.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
