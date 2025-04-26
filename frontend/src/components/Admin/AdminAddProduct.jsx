import { Link } from "react-router-dom";
export default function AdminAddProduct() {
  return (
    <>
      <div className="flex flex-col">
        <div className="header flex gap-[1rem] items-center px-[1rem]">
          <p className="text-3xl font-semibold mb-[0.5rem]">Add A Product</p>
        </div>
        <div className="flex px-[20rem] py-[3rem]">
          <form className="flex flex-col gap-[0.5rem]">
            <label htmlFor="name">Name:</label>
            <input type="text" className="border-1 rounded-sm gap-2" />
            <label htmlFor="price">Price:</label>
            <input type="text" className="border-1 rounded-sm" />
            <label htmlFor="quantity">Quantity:</label>
            <input type="text" className="border-1 rounded-sm" />
            <label htmlFor="weight">Brand:</label>
            <input type="text" className="border-1 rounded-sm" />
            <label htmlFor="description">Description:</label>
            <input type="text" className="border-1 rounded-sm" />
            <label htmlFor="category">Category: </label>
            <input type="text" className="border-1 rounded-sm" />
            <button type="submit" className="border rounded-sm bg-blue-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
