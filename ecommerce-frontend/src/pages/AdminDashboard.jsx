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
