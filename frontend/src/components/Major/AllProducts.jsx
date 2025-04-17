import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../ProductCard";
const BASE_URL = "http://localhost:3000/products";

export default function Main() {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        let response;
        if (category) {
          response = await fetch(`${BASE_URL}?category=${category}`, {
            mode: "cors",
          });
        } else {
          response = await fetch(`${BASE_URL}`, {
            mode: "cors",
          });
        }
        const products = await response.json();
        setProducts(products);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (isLoading) {
    return (
      <div className="flex grow items-center justify-center">Loading...</div>
    );
  }

  if (error) {
    return <div>Something went wrong! Please try again.</div>;
  }

  return (
    <div className="grow grid grid-cols-4 gap-5 py-5 px-5">
      {products.map((product) => {
        return (
          <ProductCard
            name={product.name}
            price={product.price}
            weight={product.weight}
            url={product.img_url}
            key={product.name}
          />
        );
      })}
    </div>
  );
}
