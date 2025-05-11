import useFetch from "../../hooks/useFetch";
import { useState } from "react";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:3000/api/products";

export default function AdminHome() {
  const { data: products, isLoading, error, refetch } = useFetch(`${BASE_URL}`);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!products) return <div>Products not found</div>;

  function ProductCard({ product }) {
    const [isEditing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
      name: product.name,
      price: product.price,
      weight: product.weight,
      stock: product.stock,
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSave = async () => {
      try {
        const res = await fetch(`${BASE_URL}/${product.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Failed to update product");

        const updatedProduct = await res.json();
        console.log("Updated product:", updatedProduct);
        setEditing(false);
      } catch (err) {
        console.error(err);
        alert("Error saving product.");
      }
    };

    const handleDelete = async () => {
      if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
        try {
          const res = await fetch(`${BASE_URL}/${product.id}`, {
            method: "DELETE",
          });

          if (!res.ok) throw new Error("Failed to delete product");

          alert(`${product.name} has been deleted.`);
          refetch();
        } catch (err) {
          console.error(err);
          alert("Error deleting product.");
        }
      }
    };

    return (
      <div className="product-card flex flex-col justify-center items-center border rounded-md gap-4 relative">
        <div
          className="absolute top-1 right-1 text-red-500 font-bold cursor-pointer h-5 w-5 flex items-center justify-center text-lg"
          onClick={handleDelete}
          title="Delete product"
        >
          ×
        </div>

        <img
          className="pt-4 items-center w-[80px] h-[96px]"
          src={product.img_url}
          alt={product.name}
        />
        <div className="card-info flex flex-col gap-2 min-w-full px-4 mb-4">
          {isEditing ? (
            <>
              <div className="flex justify-between font-semibold px-[1rem] gap-1">
                <input
                  className="border rounded px-1 w-[90px]"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <div className="flex">
                  $
                  <input
                    className="border rounded px-1 w-[55px]"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="text-xs flex px-[1rem] gap-1">
                Weight:
                <input
                  className="border rounded px-1 text-xs w-[55px]"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                />
                lbs
              </div>
              <div className="text-xs flex px-[1rem] gap-1">
                Quantity:
                <input
                  className="border rounded px-1 w-[55px]"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-between gap-2 text-sm px-[1rem]">
                <button
                  onClick={() => setEditing(false)}
                  className="text-red-500 hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="text-green-600 hover:cursor-pointer"
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="name-price flex justify-between font-semibold">
                <p>{formData.name}</p>
                <p>${Number(formData.price).toFixed(2)}</p>
              </div>
              <p className="text-xs">Weight: {formData.weight} lbs</p>
              <div className="flex justify-between text-xs">
                <span>Quantity: {formData.stock}</span>
                <button
                  onClick={() => setEditing(true)}
                  className="text-blue-500 hover:cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-content flex flex-col gap-8 min-h-screen px-[1rem]">
        <div className="header flex gap-[1rem] items-center">
          <p className="text-2xl mb-[0.5rem]">Products</p>
          <Link
            to="AddProduct"
            className="py-[0.25rem] px-[0.5rem] text-[0.875rem] border rounded-sm bg-blue-200"
          >
            Add a product
          </Link>
        </div>

        <div className="sidebar-products grid grid-cols-[1fr_4fr]">
          <div></div>
          <div className="products-container grid grid-cols-[repeat(auto-fit,minmax(150px,190px))] items-start gap-[1rem] py-4 px-8">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
