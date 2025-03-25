import {useState,  useContext } from "react";
import { CartContext } from "../contexts/CartContext";
export default function Checkout() {
  const {cart, setCart} = useContext(CartContext);
  return <div className="flex flex-row grow">
    <div className="flex flex-col basis-1/2 px-20 py-25 ">
    {cart.map((product)=>{
      return <ul><li>{product.name} {product.qty} ${product.price} ${product.price*product.qty}</li></ul>
    })}
    </div>
    <div className="basis-1/2 flex py-30 justify-center">
     <div className="border border-gray-400 w-108 h-108 rounded-md p-4">
     Checkout 
      </div> 
    </div>
  </div>;
}
