import { Link } from "react-router-dom";
import vegetables from "../assets/vegetables.png";
import fruits from "../assets/fruits.png";
import meat from "../assets/meat.png";
import cheese from "../assets/swiss-cheese.svg";
import React from "react";

export default function Home() {
  return (
    <div className="grow">
      <h1 className="flex py-20 text-5xl align-center justify-center font-bold font-stretch-ultra-expanded text-gray-700">
        Welcome to Spartan Shop!
      </h1>
      <div className="flex flex-row gap-25 justify-center">
        <Link to="categories">
          <div className="flex flex-col border-1 h-108 w-64 rounded-md justify-center">
            <img className="basis-3/4 p-4" src={vegetables}></img>
            <p className="flex basis-1/4 border-t grow-6 items-center justify-center text-2xl font-bold">
              Vegetables
            </p>
          </div>
        </Link>
        <Link to="categories">
          <div className="flex flex-col border-1 h-108 w-64 rounded-md justify-center">
            <img className="basis-3/4 p-4" src={fruits}></img>
            <p className="flex basis-1/4 border-t items-center justify-center text-2xl font-bold">
              Fruits
            </p>
          </div>
        </Link>
        <Link to="categories">
          <div className="flex flex-col border-1 h-108 w-64 rounded-md justify-center">
            <img className="basis-3/4" src={meat}></img>
            <p className="flex basis-1/4 border-t items-center justify-center text-2xl font-bold">
              Meats
            </p>
          </div>
        </Link>
        <Link to="categories">
          <div className="flex flex-col border-1 h-108 w-64 rounded-md justify-center">
            <img className="basis-3/4" src={cheese}></img>
            <p className="flex basis-1/4 border-t items-center justify-center text-2xl font-bold">
              Dairy
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
