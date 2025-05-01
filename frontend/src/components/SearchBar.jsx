import { Search } from "lucide-react";

export default function SearchBar({ query, onChange }) {
  return (
    <div className="relative w-full">
      <input
        className="pl-10 pr-4 py-2 w-full bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={onChange}
        placeholder="Search products..."
      />
      <Search 
        size={20} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}