import { Link } from "react-router-dom";

function Home() {
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
          <Link to="/products" className="btn btn-primary px-8 py-3 text-lg">
            Shop Now
          </Link>
          <Link to="/products" className="btn btn-secondary px-8 py-3 text-lg">
            Browse Collection
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="text-3xl mb-3">✓</div>
          <h3 className="font-semibold text-lg mb-2">Quality First</h3>
          <p className="text-neutral-600 text-sm">Carefully selected products that last</p>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl mb-3">→</div>
          <h3 className="font-semibold text-lg mb-2">Fast Shipping</h3>
          <p className="text-neutral-600 text-sm">Get your order delivered quickly</p>
        </div>
        <div className="card p-6 text-center">
          <div className="text-3xl mb-3">★</div>
          <h3 className="font-semibold text-lg mb-2">Customer Focus</h3>
          <p className="text-neutral-600 text-sm">Your satisfaction is our priority</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
