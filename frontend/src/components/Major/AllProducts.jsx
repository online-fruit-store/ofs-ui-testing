import { useEffect } from "react";
import { useState } from "react";

import ProductCard from "../ProductCard";
const BASE_URL = "http://localhost:3000/products";

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
    return (
      <div className="flex grow items-center justify-center">Loading...</div>
    );
  }

  if (error) {
    return <div>Something went wrong! Please try again.</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-5 py-5 px-5">
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
