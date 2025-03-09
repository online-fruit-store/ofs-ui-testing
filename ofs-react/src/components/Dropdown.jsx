import { useState } from "react";

function Dropdown({ text }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="px-4 py-2 bg-blue-500 text-black rounded">
        {text}
      </button>
      {isOpen && (
        <ul className="absolute left-0 mt-0 w-48 bg-white border rounded shadow-lg">
          <li className="px-4 py-2 hover:bg-gray-100">Option 1</li>
          <li className="px-4 py-2 hover:bg-gray-100">Option 2</li>
          <li className="px-4 py-2 hover:bg-gray-100">Option 3</li>
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
