import useFetch from "../../hooks/useFetch";
import { Link } from "react-router-dom";
const BASE_URL = "http://localhost:3000/products";
export default function AdminHome() {
  const { data: products, isLoading, error } = useFetch(`${BASE_URL}`);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!products) return <div>Products not found</div>;

  return (
    <>
      <div className="container ">
        <div className="main-content flex flex-col gap-8 min-h-screen px-[1rem]">
          <div className="header flex gap-[1rem] items-center">
            <p className="text-2xl mb-[0.5rem]">Products</p>
            <Link
              to="#"
              className="py-[0.25rem] px-[0.5rem] text-[0.875rem] border rounded-sm"
            >
              Add a product
            </Link>
          </div>

          <div className="sidebar-products grid grid-cols-[1fr_4fr]">
            <div></div>
            <div className="products-container grid grid-cols-[repeat(auto-fit,minmax(150px,190px))] items-start gap-[1rem] py-4 px-8">
              {products.map((p) => {
                return (
                  <div className="product-card flex flex-col justify-center items-center border rounded-md gap-4">
                    <img
                      className="pt-4 items-center w-[80px] h-[96px]"
                      src={p.img_url}
                      alt={p.name}
                    />
                    <div className="flex flex-col gap-2 card-info min-w-full px-4 mb-4">
                      <div className="name-price flex gap-4 justify-between font-semibold">
                        <p>{p.name}</p>
                        <p>${p.price.toFixed(2)}</p>
                      </div>
                      <p className="weight text-xs leading-[0.75rem]">
                        Weight: {p.weight} lbs
                      </p>
                      <p className="flex qty text-xs leading-[0.75rem] justify-between">
                        <p>Quantity: {p.stock}</p>
                        <Link to="#" className="text-blue-700">
                          Edit
                        </Link>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
