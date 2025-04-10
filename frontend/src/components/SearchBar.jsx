export default function SearchBar({ query, onChange }) {
  return (
    <>
      <input
        className="p-2 w-full bg-white rounded-sm"
        value={query}
        onChange={onChange}
      />
    </>
  );
}
