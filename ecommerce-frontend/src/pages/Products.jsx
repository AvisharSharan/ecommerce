import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [price, setPrice] = useState({ min: "", max: "" });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/products");
        setProducts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Apply URL parameters to filters
  useEffect(() => {
    const searchParam = searchParams.get("search");
    const categoryParam = searchParams.get("category");
    
    if (searchParam) {
      setSearch(searchParam);
    }
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    return ["all", ...new Set(products.map(p => p.category).filter(Boolean))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      list = list.filter(p => p.category === category);
    }

    if (price.min) list = list.filter(p => p.price >= +price.min);
    if (price.max) list = list.filter(p => p.price <= +price.max);

    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, search, category, sort, price]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setSort("default");
    setPrice({ min: "", max: "" });
  };

  /* ---------- UI STATES ---------- */

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 rounded-lg bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600 py-12">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-600">
          {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Filters */}
      <div className="card p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input"
          >
            <option value="default">Sort By</option>
            <option value="name">Name (A–Z)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>

        {(search || category !== "all" || sort !== "default" || price.min || price.max) && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-primary-600 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No products found</p>
          <button onClick={resetFilters} className="btn btn-primary">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="card p-4 group"
            >
              <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-2">
                {product.name}
              </h3>

              {product.category && (
                <span className="badge badge-primary mb-2">
                  {product.category}
                </span>
              )}

              <p className="text-lg font-bold text-primary-600">
                ${product.price}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
