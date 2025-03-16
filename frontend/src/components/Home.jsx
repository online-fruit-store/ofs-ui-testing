import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
const BASE_URL = "http://localhost:3000/products";
import ProductCard from "./ProductCard";

export default function Main() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`${BASE_URL}`, {
          mode: "cors",
        });
        const products = await response.json();
        setProducts(products);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong! Please try again.</div>;
  }

  return (
    <div className="p-10 grid grid-flow-row grid-cols-4 gap-10">
      {products.map((product) => {
        return (
          <ProductCard
            name={product.name}
            price={product.price}
            url={product.img_url}
            key={product.name}
          />
        );
      })}
    </div>
  );
}
