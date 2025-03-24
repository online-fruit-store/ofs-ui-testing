import { useState } from "react";
import Login from "../components/Login";
import Registration from "../components/Registration";
export default function Auth() {
  const COLORS = [
    "border-2 rounded-md p-2 bg-sky-500 text-white border-black font-semibold",
    "border-2 rounded-md p-2 bg-gray-300",
  ];
  const [activeComponent, setActiveComponent] = useState("A");

  return (
    <div className="flex items-center grow justify-center">
      <div className="border-3 rounded-md bg-sky-50 w-md h-140">
        <div className="flex justify-center pt-20 pb-5 gap-2">
          <button
            className={activeComponent === "A" ? COLORS[0] : COLORS[1]}
            onClick={() => setActiveComponent("A")}
          >
            Log In{" "}
          </button>
          <button
            className={activeComponent === "B" ? COLORS[0] : COLORS[1]}
            onClick={() => setActiveComponent("B")}
          >
            Register{" "}
          </button>
        </div>
        {activeComponent === "A" ? <Login /> : <Registration />}
      </div>
    </div>
  );
}
