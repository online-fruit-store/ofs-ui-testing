import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    weight: "",
    stock: "",
    description: "",
    category: "",
    img_url: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.weight) {
      newErrors.weight = "Weight is required";
    } else if (
      isNaN(parseFloat(formData.weight)) ||
      parseFloat(formData.weight) <= 0
    ) {
      newErrors.weight = "Weight must be a positive number";
    }

    if (!formData.stock) {
      newErrors.stock = "Quantity/stock is required";
    } else if (
      isNaN(parseInt(formData.stock)) ||
      parseInt(formData.stock) < 0
    ) {
      newErrors.stock = "Quantity must be a non-negative number";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        weight: parseFloat(formData.weight),
        stock: parseInt(formData.stock),
      };

      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add product");
      }

      setSuccess(true);
      setFormData({
        name: "",
        price: "",
        weight: "",
        stock: "",
        description: "",
        category: "",
        img_url: "",
      });

      setTimeout(() => {
        navigate("/Admin");
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred while adding the product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200">
        <div className="bg-blue-500 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-white">
              Add New Product
            </h1>
            <Link to="/Admin" className="bg-blue-400 text-white px-4 py-2">
              Back to Products
            </Link>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 mb-4">
              Product added successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Product Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.name ? "border-red-400" : "border-gray-300"
                  } focus:outline-none focus:border-blue-400`}
                  placeholder="Enter product name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Category*
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.category ? "border-red-400" : "border-gray-300"
                  } focus:outline-none focus:border-blue-400 bg-white`}
                >
                  <option value="">Select a category</option>
                  <option value="fruit">Fruit</option>
                  <option value="vegetable">Vegetable</option>
                  <option value="meat">Meat</option>
                  <option value="dairy">Dairy</option>
                  <option value="grains">Grains</option>
                  <option value="deli">Deli</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Price ($)*
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.price ? "border-red-400" : "border-gray-300"
                  } focus:outline-none focus:border-blue-400`}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Quantity in Stock*
                </label>
                <input
                  type="text"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.stock ? "border-red-400" : "border-gray-300"
                  } focus:outline-none focus:border-blue-400`}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="weight"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Weight (lbs)*
                </label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.weight ? "border-red-400" : "border-gray-300"
                  } focus:outline-none focus:border-blue-400`}
                  placeholder="0.0"
                />
                {errors.weight && (
                  <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="img_url"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Image URL
                </label>
                <input
                  type="text"
                  id="img_url"
                  name="img_url"
                  value={formData.img_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-400"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-400"
                placeholder="Enter product description"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                to="/Admin"
                className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
