import { useState } from "react";
import Login from "../components/Login";
import Registration from "../components/Registration";
export default function Auth() {
  const COLORS = [
    "rounded-md p-2 bg-red-600 hover:bg-red-500 text-sm/6 shadow-xs text-white font-semibold",
    "rounded-md p-2 bg-gray-300 hover:bg-red-500 hover:text-white text-sm/6 font-semibold",
  ];
  const [activeComponent, setActiveComponent] = useState("A");

  return (
    <div className="flex items-center grow justify-center py-15">
      <div className="border-1 rounded-md w-md">
        <div className="flex justify-center pt-10 pb-5 gap-2">
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
