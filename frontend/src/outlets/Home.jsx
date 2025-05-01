import { Link } from "react-router-dom";
import vegetables from "../assets/vegetables.png";
import fruits from "../assets/fruits.png";
import meat from "../assets/meat.png";
import dairy from "../assets/dairy.png";
import { ShoppingCart, Wind } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 items-center gap-12 px-4 pb-5 mt-15 md:grid-cols-2 md:gap-20 md:px-8">
          <div>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
              Welcome to <span className="text-blue-900">Spartan Food Store</span>
            </h1>
            <p className="mb-8 max-w-md text-lg text-neutral-600">
              Get fresh groceries online without stepping out to make delicious
              food with the freshest ingredients
            </p>
          </div>
          {/* Updated Icons Container */}
          <div className="flex items-center justify-center gap-0 md:justify-end">
            <Wind className="rotate-180 hidden md:block pr-0" size={250} />
            <ShoppingCart className="hidden md:block" size={275} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl px-4 pb-24 md:px-8">
        <div className="flex flex-wrap justify-center gap-6">
          <CategoryCard 
            to="products?category=vegetable" 
            image={vegetables} 
            name="Vegetables" 
          />
          <CategoryCard 
            to="products?category=fruit" 
            image={fruits} 
            name="Fruits" 
          />
          <CategoryCard 
            to="products?category=meat" 
            image={meat} 
            name="Meats" 
          />
          <CategoryCard 
            to="products?category=dairy" 
            image={dairy} 
            name="Dairy" 
          />
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ to, image, name }) {
  return (
    <Link
      to={to}
      className="block w-full sm:w-[calc(50%-1rem)] lg:w-[calc(24%-1rem)]"
    >
      <div className="relative h-40 md:h-48 overflow-hidden rounded-lg shadow-sm transition duration-300 hover:shadow-xl hover:shadow-gray-700">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />

        <div className="absolute inset-0 bg-black/40" />

        <p className=" h-full flex flex-col items-center justify-center p-6 text-3xl font-bold leading-tight text-white drop-shadow-lg">
          {name
            .split(' ')
            .map(word => (
              <span key={word}>{word}</span>
            ))}
        </p>
      </div>
    </Link>
  );
}


