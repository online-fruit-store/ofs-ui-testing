import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";

const BASE_URL = "http://localhost:3000/products";

export default function ProductPage() {
  const { productName } = useParams();
  const {
    data: product,
    isLoading,
    error,
  } = useFetch(`${BASE_URL}/${productName}`);
  console.log(`${BASE_URL}/${productName}`);
  console.log(product);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <img
        src={product.img_url}
        alt={product.name}
        className="w-64 h-64 object-cover my-4"
      />
      <p className="text-xl text-gray-700">Price: ${product.price}</p>
      <p className="text-lg">Some description here</p>
    </div>
  );
}
