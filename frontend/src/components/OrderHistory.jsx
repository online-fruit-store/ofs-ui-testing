import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OrderHistory() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/status", {
          credentials: "include",
        });
        const data = await response.json();

        if (data.loggedIn) {
          setUser(data.user);
          fetchOrders(data.user.id);
        } else {
          navigate("/login", {
            state: { message: "Please log in to view your order history" },
          });
        }
      } catch (err) {
        setError("Failed to check authentication status");
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/orders/user/${userId}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load order history");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const viewOrderDetails = (orderId) => {
    navigate(`/Orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full w-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 p-8 mt-15">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Order History</h1>

        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Hello, {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-600">
              Here's a summary of your past orders.
            </p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      ${parseFloat(order.total).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  {order.items &&
                    order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center py-2 border-b last:border-0"
                      >
                        <div className="w-16 h-16 flex-shrink-0 mr-4">
                          <img
                            src={item.img_url || "/placeholder.png"}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × $
                            {parseFloat(item.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            $
                            {(item.quantity * parseFloat(item.price)).toFixed(
                              2
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                  <button
                    onClick={() => viewOrderDetails(order.id)}
                    className="text-blue-500 hover:text-blue-700 hover:cursor-pointer"
                  >
                    View Details
                  </button>

                  {order.status === "delivered" && (
                    <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm">
                      Buy Again
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
