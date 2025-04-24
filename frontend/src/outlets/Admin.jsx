import { useEffect, useState } from "react";
const BASE_URL = "http://localhost:3000";

export default function Admin() {
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
    <div>
      <h1 className="mb-4 text-2xl">Data Fetching in React</h1>
      <ul>
        {products.map((product) => {
          return <li>{product.name}</li>;
        })}
      </ul>
    </div>
  );
}
