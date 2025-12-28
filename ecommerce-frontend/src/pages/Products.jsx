import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
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
            <option value="default">Default</option>
            <option value="name">Name (A–Z)</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={price.min}
              onChange={(e) => setPrice({ ...price, min: e.target.value })}
              className="input"
            />
            <input
              type="number"
              placeholder="Max"
              value={price.max}
              onChange={(e) => setPrice({ ...price, max: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <button
            onClick={resetFilters}
            className="text-sm text-gray-700 hover:text-green-600"
          >
            Reset filters
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-3">No products found</p>
          <button onClick={resetFilters} className="btn btn-primary">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <Link
              key={product._id}
              to={`/products/${product._id}`}
              className="group border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-green-300 transition-all"
            >
              <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden mb-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <h3 className="font-medium text-gray-900 truncate group-hover:text-green-600 transition-colors">
                {product.name}
              </h3>

              {product.category && (
                <span className="inline-block mt-1 text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">
                  {product.category}
                </span>
              )}

              <p className="mt-2 text-lg font-bold text-green-600">
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
