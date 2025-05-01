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
    <div className="w-full py-8 px-4 mt-15">
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 justify-center">
          {products.map((product) => (
            <div key={product.name} className="flex justify-center">
              <ProductCard
                name={product.name}
                price={product.price}
                weight={product.weight}
                url={product.img_url}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
