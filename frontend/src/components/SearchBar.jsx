import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const { data: products, isLoading } = useFetch(
    "http://localhost:3000/api/products"
  );

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    if (products && products.length > 0) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 20));
    }
  }, [query, products]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() && results.length > 0) {
      navigate(`/products/${results[0].id}`);
      setQuery("");
      setResults([]);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            className="pl-10 pr-4 py-2 w-full bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search products..."
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </form>

      {isFocused && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {results.map((product) => (
            <div
              key={product.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onMouseDown={() => {
                navigate(`/products/${product.id}`);
                setQuery("");
                setResults([]);
              }}
            >
              <img
                src={product.img_url}
                alt={product.name}
                className="w-8 h-8 object-cover mr-3"
              />
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
