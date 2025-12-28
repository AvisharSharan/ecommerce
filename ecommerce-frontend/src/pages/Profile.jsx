import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // User details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  
  // Orders
  const [orders, setOrders] = useState([]);
  
  // Edit modes
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  
  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [profileRes, ordersRes] = await Promise.all([
        api.get("/api/users/profile"),
        api.get("/api/users/orders"),
      ]);
      
      setName(profileRes.data.name);
      setEmail(profileRes.data.email);
      setShippingAddress(profileRes.data.shippingAddress || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      });
      setOrders(ordersRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      const { data } = await api.put("/api/users/profile", { email });
      setSuccess("Email updated successfully!");
      setEditingEmail(false);
      
      // Update local storage
      const updatedUser = { ...user, email: data.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update email");
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      await api.put("/api/users/profile", { shippingAddress });
      setSuccess("Shipping address updated successfully!");
      setEditingAddress(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update address");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    try {
      await api.delete("/api/users/profile");
      logout();
      navigate("/register");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <p className="text-neutral-600 text-center py-12">Loading profile...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">My Account</h1>
        <p className="text-neutral-600">Manage your profile and view your orders</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neutral-900">Profile Information</h2>
            </div>
            
            <div className="space-y-4">
              {/* Name (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Name</label>
                <div className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <p className="text-neutral-900">{name}</p>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Email Address</label>
                {!editingEmail ? (
                  <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <p className="text-neutral-900">{email}</p>
                    <button
                      onClick={() => setEditingEmail(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateEmail} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input w-full"
                      required
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="btn btn-primary text-sm">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEmail(false);
                          fetchUserData();
                        }}
                        className="btn btn-secondary text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
              {!editingAddress && (
                <button
                  onClick={() => setEditingAddress(true)}
                  className="text-sm text-green-600 hover:text-green-700 font-semibold"
                >
                  {shippingAddress.street ? "Edit" : "Add Address"}
                </button>
              )}
            </div>

            {!editingAddress ? (
              <div>
                {shippingAddress.street ? (
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-900">{shippingAddress.street}</p>
                    <p className="text-gray-900">
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                    </p>
                    <p className="text-gray-900">{shippingAddress.country}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No shipping address added</p>
                )}
              </div>
            ) : (
              <form onSubmit={handleUpdateAddress} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="input w-full"
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="input w-full"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">State</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="input w-full"
                      placeholder="NY"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      className="input w-full"
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      className="input w-full"
                      placeholder="USA"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary text-sm">
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddress(false);
                      fetchUserData();
                    }}
                    className="btn btn-secondary text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order History */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500 italic">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-green-300 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order #{order._id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Delivered" ? "bg-green-100 text-green-700" :
                        order.status === "Processing" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">${item.price}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Total</span>
                      <span className="text-lg font-bold text-green-600">${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Danger Zone */}
        <div className="lg:col-span-1">
          <div className="card p-6 border-2 border-red-200">
            <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
            <p className="text-sm text-gray-600 mb-4">
              Once you delete your account, there is no going back. This will permanently delete your account and all associated data.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full btn bg-red-600 text-white hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            <p className="text-sm text-neutral-700 mb-2 font-semibold">
              Type <span className="text-red-600">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="input w-full mb-4"
              placeholder="DELETE"
            />
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 btn bg-red-600 text-white hover:bg-red-700"
                disabled={deleteConfirmation !== "DELETE"}
              >
                Delete Forever
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                  setError("");
                }}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
