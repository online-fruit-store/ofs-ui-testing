import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/orders/${orderId}`,
          {
            credentials: "include", // Important for cookies
          }
        );

        if (!response.ok) {
          if (response.status === 403) {
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();

        if (!data.success || !data.order) {
          throw new Error("Invalid order data received");
        }

        console.log("Order data:", data.order); // Debug
        setOrder(data.order);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order details");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 mt-15">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p>{error}</p>
          <Link
            to="/orders"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen p-8 mt-15">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-700">This order could not be found.</p>
          <Link
            to="/orders"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const items = order.items || [];

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * parseInt(item.quantity),
    0
  );

  const taxRate = 0.1025; // 10.25%
  const tax = subtotal * taxRate;

  const totalWeight = items.reduce(
    (sum, item) => sum + parseFloat(item.weight || 0) * parseInt(item.quantity),
    0
  );

  const shippingFee = totalWeight >= 20 ? 5 : 0;

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8 mt-15">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Order #{order.id}</h1>
          <Link to="/orders" className="text-blue-500 hover:underline">
            ← Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex justify-between flex-wrap">
              <div className="mb-4 md:mb-0">
                <h2 className="font-semibold">Order Details</h2>
                <p className="text-sm text-gray-500">
                  Placed on {formatDate(order.created_at)}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium 
                  ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
                {order.transaction_id && (
                  <p className="text-sm text-gray-500 mt-1">
                    Transaction: {order.transaction_id}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-semibold mb-4">Items</h3>
            {items.length === 0 ? (
              <p className="text-gray-500">No items found for this order.</p>
            ) : (
              items.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center py-4 border-b last:border-0"
                >
                  <div className="w-20 h-20 flex-shrink-0 mr-4">
                    <img
                      src={item.img_url || "/placeholder.png"}
                      alt={item.name || `Product ${item.product_id}`}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/80";
                      }}
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">
                      {item.name || `Product ${item.product_id}`}
                    </h4>
                    <p className="text-sm text-gray-500">
                      ${parseFloat(item.price).toFixed(2)} each
                    </p>
                    {item.weight && (
                      <p className="text-sm text-gray-500">
                        Weight: {item.weight} lbs each
                      </p>
                    )}
                  </div>
                  <div className="text-center mx-4">
                    <span className="text-gray-500">Qty:</span>
                    <p className="font-medium">{item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      $
                      {(
                        parseInt(item.quantity) * parseFloat(item.price)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>
                  {shippingFee === 0 ? "Free" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10.25%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {totalWeight > 0 && (
                <div className="flex justify-between">
                  <span>Total Weight:</span>
                  <span>{totalWeight.toFixed(2)} lbs</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t font-bold">
                <span>Total:</span>
                <span>${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {order.shipping_address && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="font-semibold mb-4">Shipping Address</h3>
              <p className="whitespace-pre-line">{order.shipping_address}</p>
            </div>
          </div>
        )}

        {order.last4 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <div className="p-6">
              <h3 className="font-semibold mb-4">Payment Information</h3>
              <p>Credit card ending in {order.last4}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
