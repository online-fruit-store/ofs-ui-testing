import { useState } from "react";
import { Link } from "react-router-dom";
function Dropdown({
  text,
  className,
  listItems = ["Option 1", "Option 2", "Option 3"],
  link,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={className}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link to={link}>
        <button className="px-4 py-2 font-bold text-white rounded hover:ring">
          {text}
        </button>
      </Link>
      {isOpen && (
        <ul className="absolute left-0 mt-0 w-48 bg-white border rounded shadow-lg">
          {listItems.map((item) => {
            return <li className="px-4 py-2 hover:bg-gray-100">{item}</li>;
          })}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
