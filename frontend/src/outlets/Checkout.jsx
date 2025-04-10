import { useState, useContext } from "react";
import { CartContext } from "../contexts/CartContext";

export default function Checkout() {
  const { cart, setCart } = useContext(CartContext);
  return (
    <div className="flex flex-row grow">
      <div className="flex basis-1/2 justify-center py-10">
        <div className="flow-root">
          <ul role="list" className="-my-6 divide-y divide-gray-200">
            {cart.map((product) => (
              <li key={product.id} className="flex py-6">
                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    alt={product.imageAlt}
                    src={product.url}
                    className="size-full object-cover"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <a href={product.href}>{product.name}</a>
                      </h3>
                      <p className="ml-4">${product.price}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.color}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <p className="text-gray-500">Qty {product.qty}</p>

                    <div className="flex">
                      <button
                        type="button"
                        className="font-medium text-red-600 hover:text-red-500 hover:cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="basis-1/2 flex py-30 justify-center rounded-lg">
        <div className="bg-gray-50 w-144 h-96 rounded-md p-8 text-gray-900 font-medium text-lg">
          Order Summary
        </div>
      </div>
    </div>
  );
}
