import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-12 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Access Denied</h2>
          <p className="text-neutral-600 mb-6">You need admin privileges to access this page.</p>
          <button onClick={() => window.history.back()} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default AdminRoute;
