import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Home() {
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

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card p-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome to ShopHub</h2>
        <p className="text-gray-600 mb-6">Discover quality products at great prices</p>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="px-4 py-2 bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-pill border-2 border-gray-200 hover:border-primary-300 transition-all font-medium"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto border-4 border-primary-200 border-t-primary-600 rounded-pill animate-spin mb-3"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        )}

        {error && (
          <div className="card p-8 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-gray-600">No products available</p>
          </div>
        )}

        {!loading && !error && featuredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="card p-4 group"
              >
                <div className="aspect-square bg-gray-100 rounded-2xl mb-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {product.category && (
                  <span className="badge badge-primary mb-2">
                    {product.category}
                  </span>
                )}
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-primary-600">${product.price}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
