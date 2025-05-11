import { useParams } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import useFetch from "../hooks/useFetch";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:3000/api/products";

export default function ProductPage() {
  const { cart, setCart } = useContext(CartContext);
  const { productName } = useParams();
  const {
    data: product,
    isLoading,
    error,
  } = useFetch(`${BASE_URL}/${productName}`);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  function addToCart() {
    const { name, price, weight, img_url: url } = product;

    toast(`${name} added to cart!`);

    const existingProduct = cart.find((p) => p.name === name);
    if (existingProduct) {
      setCart(
        cart.map((p) => (p.name === name ? { ...p, qty: p.qty + 1 } : p))
      );
    } else {
      setCart([...cart, { name, qty: 1, price, weight, url }]);
    }
  }

  return (
    <div className="p-5 grow mt-15">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <div className="w-64 h-64 flex items-center justify-center">
        <img
          src={product.img_url}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      <p className="text-xl text-gray-700">Price: ${product.price}</p>
      <p className="text-xl text-gray-700">Weight: {product.weight} lbs</p>
      <p className="text-lg">{product.description}</p>

      <button
        type="submit"
        onClick={addToCart}
        className="border-2 border-none px-2 py-1 bg-blue-800 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-900 transition delay-150 duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-110"
      >
        Add to Cart
      </button>
    </div>
  );
}
