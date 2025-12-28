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

  const scrollToProducts = () => {
    document.getElementById('products-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="space-y-12">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-neutral-900 mb-4">
          Modern. Simple. Quality.
        </h1>
        <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
          Discover curated products designed for everyday living
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={scrollToProducts} className="btn btn-primary px-8 py-3 text-lg">
            Shop Now
          </button>
          <Link to="/products" className="btn btn-secondary px-8 py-3 text-lg">
            Browse All
          </Link>
        </div>
      </section>

      <section id="products-section">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">Featured Products</h2>
          <p className="text-neutral-600">Check out our latest collection</p>
        </div>

        {loading && (
          <p className="text-neutral-600 text-center py-12">Loading products...</p>
        )}

        {error && (
          <p className="text-red-600 text-center py-12">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="card p-12 text-center">
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No Products Available</h3>
            <p className="text-neutral-600 mb-4">Check back soon for new items!</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
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
        )}
      </section>
    </div>
  );
}

export default Home;
