import logo from "../assets/spartans.png";
import Dropdown from "../components/Dropdown";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
const BASE_URL = "http://localhost:3000/categories";

export default function Header() {
  const { data: categories, isLoading, error } = useFetch(BASE_URL);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong! Please try again.</div>;
  }
  return (
    <div className="flex gap-10 p-5 shadow-sm bg-cyan-500 shadow-cyan-500/50">
      <Link to="/">
        <div className="shrink flex items-center gap-5 grow">
          <img className="w-20" src={logo} alt="Spartan Logo" />
          <p className="text-3xl font-bold text-wrap text-white max-w-50">
            Spartan Food Store
          </p>
        </div>
      </Link>

      <div className="grow-8 flex items-center">
        <input
          className="border w-full p-2 bg-white rounded-lg"
          id="searchBox"
          type="text"
          placeholder="Search"
        />
      </div>

      <div className="grow-1 flex items-center">
        <ul className="flex">
          <li>
            <Dropdown
              text="Categories"
              className="relative inline-block"
              listItems={categories.map((item) => item.category)}
              link={"/categories"}
            />
          </li>
          <li>
            <Dropdown
              text="Login"
              className="relative inline-block"
              link={"/Auth"}
            />
          </li>
          <li>
            <Dropdown text="Checkout" className="relative inline-block" />
          </li>
        </ul>
      </div>
    </div>
  );
}
