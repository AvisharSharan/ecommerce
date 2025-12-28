import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="text-gray-600 text-center py-12">Loading...</p>;
  if (error) return <p className="text-red-600 text-center py-12">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex flex-col">
          {product.category && (
            <span className="badge badge-primary mb-3">{product.category}</span>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <p className="text-3xl font-bold text-primary-600 mb-2">${product.price}</p>
            <p className="text-sm text-gray-600">
              {product.countInStock > 0 
                ? `${product.countInStock} in stock` 
                : 'Out of stock'
              }
            </p>
          </div>

          {product.countInStock > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-primary-50 rounded-pill font-semibold"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-bold">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-primary-50 rounded-pill font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  addToCart(product, qty);
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }} 
                className="btn btn-primary w-full"
              >
                {addedToCart ? 'Added to Cart!' : `Add ${qty} to Cart`}
              </button>
            </div>
          ) : (
            <button disabled className="btn btn-secondary w-full opacity-50 cursor-not-allowed">
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
