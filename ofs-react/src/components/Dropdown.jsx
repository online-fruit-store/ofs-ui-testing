import { useState } from "react";
import { Link } from "react-router-dom";
function Dropdown({ text, className }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={className}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="px-4 py-2 font-bold text-white rounded hover:ring">
        {text}
      </button>

      {isOpen && (
        <ul className="absolute left-0 mt-0 w-48 bg-white border rounded shadow-lg">
          <li className="px-4 py-2 hover:bg-gray-100">
            <Link to="Auth">Log in</Link>
          </li>
          <li className="px-4 py-2 hover:bg-gray-100">Option 2</li>
          <li className="px-4 py-2 hover:bg-gray-100">Option 3</li>
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
