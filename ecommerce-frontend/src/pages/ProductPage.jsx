import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { CartContext } from "../context/CartContext";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  if (loading) return <p className="text-neutral-600 text-center py-12">Loading...</p>;
  if (error) return <p className="text-red-600 text-center py-12">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col">
          <div className="mb-6">
            {product.category && (
              <span className="badge mb-2">{product.category}</span>
            )}
            <h1 className="text-4xl font-bold text-neutral-900 mb-3">{product.name}</h1>
            <p className="text-neutral-600 text-lg">{product.description}</p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-neutral-900">${product.price}</span>
            </div>
            <p className="text-sm text-neutral-600">
              {product.countInStock > 0 
                ? `${product.countInStock} in stock` 
                : 'Out of stock'
              }
            </p>
          </div>

          {product.countInStock > 0 ? (
            <button 
              onClick={() => addToCart(product)} 
              className="btn btn-primary w-full py-3 text-lg"
            >
              Add to Cart
            </button>
          ) : (
            <button disabled className="btn btn-secondary w-full py-3 text-lg opacity-50 cursor-not-allowed">
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
