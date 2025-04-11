//  import Image from "next/image"
// import Link from "next/link"
// import Farmer from "farmers-market-produce-0812211-3692542286.jpg"

import {Link} from "react-router-dom"; 

// import { ShoppingCart, MapPin, Truck } from "lucide-react"

export default function Whatever() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-green-700 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Spartan Food Store</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="#" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Products
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Delivery
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:underline">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-green-100 py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Welcome to Spartan Food Store</h2>
            <p className="text-xl mb-8">
              Your local market, now delivering fresh goodness to your doorstep!
            </p>
          </div>
        </section>

        <section id="about" className="py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">About Us</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                {/* <Image
                  src={Farmer}
                  alt="Grocer Grove Store Front"
                  width={400}
                  height={300}
                  className="rounded-lg shadow-md"
                /> */}
              </div>
              <div className="md:w-1/2 md:pl-8">
                <p className="text-lg mb-4">
                  Grocer Grove has been serving our local community with the freshest produce and pantry essentials for
                  over 30 years. We're excited to now offer the convenience of home delivery without compromising on the
                  quality you've come to expect from us.
                </p>
                <p className="text-lg">
                  Our mission is to bring the farmers' market experience right to your kitchen, supporting local growers
                  and providing you with the best nature has to offer.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="bg-green-50 py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                "Fresh Produce",
                "Dairy & Eggs",
                "Bakery",
                "Meat & Seafood",
                "Pantry Staples",
                "Local Specialties",
              ].map((category) => (
                <div key={category} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">{category}</h3>
                  <p className="text-gray-600">Discover our wide range of {category.toLowerCase()}.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="delivery" className="py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Home Delivery</h2>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-12">
              <div className="flex flex-col items-center">
                {/* <ShoppingCart className="h-16 w-16 text-green-700 mb-4" /> */}
                <h3 className="text-xl font-semibold mb-2">Easy Ordering</h3>
                <p className="text-gray-600">Browse and order from our full selection online</p>
              </div>
              <div className="flex flex-col items-center">
                {/* <Truck className="h-16 w-16 text-green-700 mb-4" /> */}
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Get your groceries delivered to your doorstep</p>
              </div>
              <div className="flex flex-col items-center">
                {/* <MapPin className="h-16 w-16 text-green-700 mb-4" /> */}
                <h3 className="text-xl font-semibold mb-2">Local Focus</h3>
                <p className="text-gray-600">Supporting local farmers and producers</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-green-100 py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
            <p className="text-xl mb-4">Have questions? We're here to help!</p>
            <div className="flex justify-center items-center">
              <span className="text-lg">Call us at: (555) 123-4567</span>
            </div>
            <p className="mt-4">Visit us at: 1 Washington Square, San Jose, USA</p>
          </div>
        </section>
      </main>

      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Grocer Grove. </p>
        </div>
      </footer>
    </div>
  )
}
