import { Link } from "react-router-dom";
import vegetables from "../assets/vegetables.png";
import fruits from "../assets/fruits.png";
import meat from "../assets/meat.png";
import cheese from "../assets/swiss-cheese.svg";

export default function Home() {
  return (
    <div className="min-w-full p-4 md:p-8 flex flex-col items-center">
      <h1 className="py-10 md:py-20 text-3xl md:text-5xl text-center font-bold text-gray-700">
        Welcome to Spartan Food Store!
      </h1>
      
      <div className="w-full max-w-6xl">
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
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
            image={cheese} 
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
      className="w-full sm:w-[calc(50%-1rem)] md:w-64 lg:w-72 flex justify-center"
    >
      <div className="bg-white flex flex-col h-full w-full max-w-xs border rounded-md transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <img 
          className="object-contain h-48 md:h-56 p-4" 
          src={image} 
          alt={name} 
        />
        <p className="border-t p-4 text-center text-xl md:text-2xl font-bold">
          {name}
        </p>
      </div>
    </Link>
  );
}