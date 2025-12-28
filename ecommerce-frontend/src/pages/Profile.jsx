import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);

  const [editingAddress, setEditingAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchOrders(), fetchUserData()]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/orders/myorders");
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders");
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await api.get("/api/users/profile");
      if (res.data?.shippingAddress) {
        setShippingAddress(res.data.shippingAddress);
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      await api.put("/api/users/profile", { shippingAddress });
      setEditingAddress(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update address");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete("/api/users/profile");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading) {
    return <p className="text-center py-12 text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-600">Manage your account & orders</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Details */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Account Details</h2>
            <p><span className="font-semibold">Name:</span> {user?.name}</p>
            <p><span className="font-semibold">Email:</span> {user?.email}</p>
          </div>

          {/* Shipping Address */}
          <div className="card p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Shipping Address</h2>
              {!editingAddress && (
                <button
                  onClick={() => setEditingAddress(true)}
                  className="btn btn-secondary text-sm"
                >
                  Edit
                </button>
              )}
            </div>

            {!editingAddress ? (
              shippingAddress.street ? (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p>{shippingAddress.street}</p>
                  <p>
                    {shippingAddress.city}, {shippingAddress.state}{" "}
                    {shippingAddress.zipCode}
                  </p>
                  <p>{shippingAddress.country}</p>
                </div>
              ) : (
                <p className="italic text-gray-500">No address added</p>
              )
            ) : (
              <form onSubmit={handleUpdateAddress} className="space-y-4">
                {["street", "city", "state", "zipCode", "country"].map((field) => (
                  <input
                    key={field}
                    className="input w-full"
                    placeholder={field}
                    value={shippingAddress[field]}
                    onChange={(e) =>
                      setShippingAddress({
                        ...shippingAddress,
                        [field]: e.target.value,
                      })
                    }
                  />
                ))}
                <div className="flex gap-2">
                  <button className="btn btn-primary">Save</button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAddress(false);
                      fetchUserData();
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order History */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Order History</h2>
            {orders.length === 0 ? (
              <p className="italic text-gray-500">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-lg p-4 hover:shadow"
                  >
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order #{order._id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-semibold">{order.status}</span>
                    </div>

                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {item.name} × {item.qty}
                        </span>
                        <span>${item.price}</span>
                      </div>
                    ))}

                    <div className="mt-2 pt-2 border-t flex justify-between font-bold">
                      <span>Total</span>
                      <span>${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          <div className="card p-6 border border-red-200">
            <h2 className="text-xl font-bold text-red-600 mb-3">
              Danger Zone
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Deleting your account is permanent.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn bg-red-600 text-white w-full"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-3">Confirm Delete</h3>
            <p className="text-sm mb-2">
              Type <b>DELETE</b> to confirm
            </p>
            <input
              className="input w-full mb-4"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                disabled={deleteConfirmation !== "DELETE"}
                onClick={handleDeleteAccount}
                className="btn bg-red-600 text-white flex-1 disabled:opacity-50"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation("");
                }}
                className="btn btn-secondary flex-1"
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
