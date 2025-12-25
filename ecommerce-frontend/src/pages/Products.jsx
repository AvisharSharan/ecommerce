import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/api/products");
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-neutral-600 text-center py-12">Loading products...</p>;
  if (error) return <p className="text-red-600 text-center py-12">{error}</p>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 mb-2">Products</h2>
        <p className="text-neutral-600">Browse our collection</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="card p-4 group"
          >
            <div className="aspect-square bg-neutral-100 rounded-lg mb-4 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-medium text-neutral-900 mb-1">{product.name}</h3>
            {product.category && (
              <p className="text-sm text-neutral-500 mb-2">{product.category}</p>
            )}
            <p className="text-lg font-semibold text-neutral-900">${product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Products;
