import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-neutral-900">Store</Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/products" className="text-neutral-600 hover:text-neutral-900 transition-colors">Products</Link>
              <Link to="/cart" className="text-neutral-600 hover:text-neutral-900 transition-colors">Cart</Link>
              {user && <Link to="/orders" className="text-neutral-600 hover:text-neutral-900 transition-colors">Orders</Link>}
              {user?.isAdmin && <Link to="/admin" className="text-neutral-600 hover:text-neutral-900 transition-colors">Admin</Link>}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-neutral-600">Hi, {user.name}</span>
                <button onClick={logout} className="btn btn-ghost">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
