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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ShopHub</h2>
        <p className="text-gray-600 mb-4">Quality products, fast delivery, great prices</p>
        <Link to="/products" className="btn btn-primary inline-flex items-center gap-2">
          Start Shopping
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{products.length}+</div>
          <div className="text-sm text-gray-600">Products</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{categories.length}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">24/7</div>
          <div className="text-sm text-gray-600">Support</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">Free</div>
          <div className="text-sm text-gray-600">Shipping</div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-3">Shop by Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="px-3 py-2 bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-600 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
              >
                {category}
              </Link>
            ))}
            <Link
              to="/products"
              className="px-3 py-2 bg-green-50 text-green-600 rounded-lg border border-green-300 hover:bg-green-100 transition-colors"
            >
              View All →
            </Link>
          </div>
        </div>
      )}

      {/* Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-1">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="card p-8 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-gray-600 mb-3">No products available</p>
            <p className="text-sm text-gray-500">Check back soon!</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="card p-4 group hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {product.category && (
                  <span className="inline-block px-2 py-1 bg-green-50 text-green-600 text-xs rounded mb-2">
                    {product.category}
                  </span>
                )}
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-green-600">${product.price}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
