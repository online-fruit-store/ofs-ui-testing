import {useState,  useContext } from "react";
import { CartContext } from "../contexts/CartContext";
export default function Checkout() {
  const {cart, setCart} = useContext(CartContext);
  return <div className="flex flex-row grow">
    <div className="flex flex-col basis-1/2 border px-10 py-10 justify-between">
    {cart.map((product)=>{
      return <li>{product.name}</li>
    })}
    </div>
    <div className="border basis-1/2 flex items-center justify-center">
     <div className="border w-108 h-108 rounded-md p-4">
     Checkout 
      </div> 
    </div>
  </div>;
}
