import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    countInStock: "",
  });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editStock, setEditStock] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);

    try {
      const { data } = await api.post("/api/products", {
        ...newProduct,
        price: parseFloat(newProduct.price),
        countInStock: parseInt(newProduct.countInStock),
      });
      setProducts([data, ...products]);
      setNewProduct({ name: "", description: "", price: "", image: "", category: "", countInStock: "" });
      setShowAddProduct(false);
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to add product");
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateStock = async (productId) => {
    try {
      const { data } = await api.put(`/api/products/${productId}`, {
        countInStock: parseInt(editStock),
      });
      setProducts(products.map(p => p._id === productId ? data : p));
      setEditingProduct(null);
      setEditStock("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update stock");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await api.delete(`/api/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleUpdateOrderStatus = async (orderId) => {
    try {
      const { data } = await api.put(`/api/orders/${orderId}/status`, {
        status: orderStatus,
      });
      setOrders(orders.map(o => o._id === orderId ? data : o));
      setEditingOrder(null);
      setOrderStatus("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "badge-success";
      case "Pending": return "badge-warning";
      case "Processing": return "badge-info";
      case "Cancelled": return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "Returned": return "bg-gradient-to-r from-slate-500 to-slate-600 text-white";
      default: return "badge-primary";
    }
  };

  if (loading) return <p className="text-neutral-600 text-center py-12">Loading admin dashboard...</p>;
  if (error) return <p className="text-red-600 text-center py-12">{error}</p>;

  return (
    <div>
      <div className="mb-10 text-center">
        <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-xl mb-4">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="section-title">
          Admin <span className="gradient-text">Dashboard</span>
        </h2>
        <p className="section-subtitle">Manage products and orders efficiently</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-neutral-900">Products</h3>
            <div className="flex gap-2 items-center">
              <span className="badge">{products.length} total</span>
              <button 
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="btn btn-primary text-sm"
              >
                {showAddProduct ? 'Cancel' : '+ Add Product'}
              </button>
            </div>
          </div>

          {showAddProduct && (
            <div className="card p-6 mb-4">
              <h4 className="font-semibold text-neutral-900 mb-4">Add New Product</h4>
              {addError && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4">{addError}</div>}
              <form onSubmit={handleAddProduct} className="space-y-3">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="input"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  required
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="input"
                />
                <input
                  type="number"
                  placeholder="Stock Count"
                  value={newProduct.countInStock}
                  onChange={(e) => setNewProduct({...newProduct, countInStock: e.target.value})}
                  required
                  className="input"
                />
                <button 
                  type="submit" 
                  disabled={addLoading}
                  className="btn btn-primary w-full"
                >
                  {addLoading ? 'Adding...' : 'Add Product'}
                </button>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {products.map((p) => (
              <div key={p._id} className="card p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">{p.name}</p>
                    <p className="text-sm text-neutral-600">Stock: {p.countInStock}</p>
                  </div>
                  <p className="font-semibold text-neutral-900">${p.price}</p>
                </div>
                
                {editingProduct === p._id ? (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="number"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      placeholder="New stock"
                      className="input text-sm flex-1"
                    />
                    <button
                      onClick={() => handleUpdateStock(p._id)}
                      className="btn btn-primary text-sm px-3"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setEditStock("");
                      }}
                      className="btn btn-ghost text-sm px-3"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => {
                        setEditingProduct(p._id);
                        setEditStock(p.countInStock.toString());
                      }}
                      className="btn btn-secondary text-sm flex-1"
                    >
                      Update Stock
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="btn text-sm px-4 bg-red-100 hover:bg-red-200 text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
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
              <div key={o._id} className="card p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Order #{o._id.slice(-8)}</p>
                    <p className="text-sm text-slate-600">{o.user?.name || 'Guest'}</p>
                    <p className="text-xs text-slate-500">{o.user?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold gradient-text">${o.totalPrice.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {editingOrder === o._id ? (
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Update Status</label>
                      <select
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="input text-sm"
                      >
                        <option value="">Select status...</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Returned">Returned</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateOrderStatus(o._id)}
                        disabled={!orderStatus}
                        className="btn btn-primary text-sm flex-1"
                      >
                        Update Status
                      </button>
                      <button
                        onClick={() => {
                          setEditingOrder(null);
                          setOrderStatus("");
                        }}
                        className="btn btn-secondary text-sm px-4"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-600">Status:</span>
                      <span className={`badge ${getStatusColor(o.status)} px-3 py-1.5`}>
                        {o.status}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setEditingOrder(o._id);
                        setOrderStatus(o.status);
                      }}
                      className="btn btn-secondary text-sm w-full"
                    >
                      Change Status
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
