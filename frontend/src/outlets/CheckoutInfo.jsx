import React, { useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
export default function PaymentForm() {
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    billingAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });

  function calculateSubtotal() {
    return cart.reduce((sum, p) => sum + p.price * p.qty, 0);
  }

  function calculateTax() {
    return calculateSubtotal() * 0.1025;
  }

  function calculateShipping() {
    return cart.reduce((weight, p) => weight + p.weight * p.qty, 0) > 20
      ? 5
      : 0;
  }

  function calculateTotal() {
    const subtotal = calculateSubtotal(cart);
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping();
    return subtotal + tax + shipping;
  }
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardNumber") {
      const cleaned = value.replace(/\D/g, "");
      const truncated = cleaned.substring(0, 16);
      const formatted = truncated.replace(/(\d{4})(?=\d)/g, "$1 ");

      setFormData({
        ...formData,
        [name]: formatted,
      });
    } else if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "");
      setFormData({
        ...formData,
        [name]: cleaned.substring(0, 4),
      });
    } else if (name === "zipCode") {
      const cleaned = value.replace(/\D/g, "");
      setFormData({
        ...formData,
        [name]: cleaned.substring(0, 5),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardName.trim()) {
      newErrors.cardName = "Cardholder name is required";
    }

    const cardNumberDigits = formData.cardNumber.replace(/\D/g, "");
    if (!cardNumberDigits) {
      newErrors.cardNumber = "Card number is required";
    } else if (cardNumberDigits.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!formData.expiryMonth) {
      newErrors.expiryMonth = "Month required";
    }
    if (!formData.expiryYear) {
      newErrors.expiryYear = "Year required";
    }

    if (formData.expiryMonth && formData.expiryYear) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const expiryYear = parseInt(formData.expiryYear);
      const expiryMonth = parseInt(formData.expiryMonth);

      if (
        expiryYear < currentYear ||
        (expiryYear === currentYear && expiryMonth < currentMonth)
      ) {
        newErrors.expiryDate = "Card is expired";
      }
    }

    if (!formData.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = "CVV must be 3-4 digits";
    }

    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = "Billing address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (formData.zipCode.length !== 5) {
      newErrors.zipCode = "ZIP code must be 5 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsProcessing(true);
      setErrors({});

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let userId = null;
        try {
          const authResponse = await fetch(
            "http://localhost:3000/auth/status",
            {
              credentials: "include",
            }
          );
          const authData = await authResponse.json();
          if (authData.loggedIn) {
            userId = authData.user.id;
          }
        } catch (authError) {
          console.warn("Could not get user authentication status:", authError);
        }

        const paymentResult = {
          success: true,
          transactionId: "DEMO-" + Math.floor(Math.random() * 1000000),
          amount: calculateTotal().toFixed(2),
          last4: formData.cardNumber.slice(-4),
          timestamp: new Date().toISOString(),
          cart: cart,
          userId: userId,
          billingAddress: formData.billingAddress,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        };

        console.log("Payment data:", paymentResult);

        const response = await fetch("http://localhost:3000/api/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentResult),
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Payment processing failed");
        }

        console.log("Payment saved and order created:", data);

        navigate("/Receipt", {
          state: {
            cartItems: cart.map((item) => ({
              ...item,
              quantity: item.qty,
            })),
            total: calculateTotal(),
            transactionId: paymentResult.transactionId,
            paymentInfo: paymentResult,
            orderId: data.orderId,
          },
        });

        setCart([]);
      } catch (error) {
        console.error("Error in payment processing:", error);
        setErrors({
          form:
            error.message ||
            "An error occurred while processing your payment. Please try again.",
        });
        setIsProcessing(false);
      }
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear + i);
    }
    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  };

  return (
    <div className="flex w-full p-30">
      <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Payment Details
        </h2>

        {errors.form && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="cardName"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Cardholder Name
            </label>
            <input
              id="cardName"
              name="cardName"
              type="text"
              placeholder="John Smith"
              value={formData.cardName}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.cardName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.cardName && (
              <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="cardNumber"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Card Number
            </label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              placeholder="1111 1111 1111 1111"
              value={formData.cardNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.cardNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
            )}
          </div>

          <div className="flex flex-wrap -mx-2 mb-6">
            <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Expiration Date
              </label>
              <div className="flex">
                <select
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleChange}
                  className={`w-1/2 mr-2 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiryMonth ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    return (
                      <option key={month} value={month}>
                        {month < 10 ? `0${month}` : month}
                      </option>
                    );
                  })}
                </select>

                <select
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleChange}
                  className={`w-1/2 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expiryYear ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Year</option>
                  {generateYearOptions()}
                </select>
              </div>
              {(errors.expiryMonth ||
                errors.expiryYear ||
                errors.expiryDate) && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.expiryDate || errors.expiryMonth || errors.expiryYear}
                </p>
              )}
            </div>

            <div className="w-full md:w-1/2 px-2">
              <label
                htmlFor="cvv"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                CVV
              </label>
              <input
                id="cvv"
                name="cvv"
                type="text"
                placeholder="123"
                value={formData.cvv}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cvv ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.cvv && (
                <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="billingAddress"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Shipping Address
            </label>
            <input
              id="billingAddress"
              name="billingAddress"
              type="text"
              placeholder="123 Main St"
              value={formData.billingAddress}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.billingAddress ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.billingAddress && (
              <p className="text-red-500 text-xs mt-1">
                {errors.billingAddress}
              </p>
            )}
          </div>

          <div className="flex flex-wrap -mx-2 mb-6">
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <label
                htmlFor="city"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="California"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <label
                htmlFor="state"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                State
              </label>
              <input
                id="state"
                name="state"
                type="text"
                placeholder="CA"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>

            <div className="w-full md:w-1/3 px-2">
              <label
                htmlFor="zipCode"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                ZIP Code
              </label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                placeholder="95127"
                value={formData.zipCode}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.zipCode ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.zipCode && (
                <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-gray-700">
                  Total Amount: <strong>${calculateTotal().toFixed(2)}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <span>
                * This is a demo form. No actual payment will be processed.
              </span>
            </div>
            <button
              type="submit"
              disabled={isProcessing}
              className={`px-6 py-2 text-white font-bold rounded-md shadow-md focus:outline-none ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-800 hover:bg-blue-900"
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Pay Now"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
