import App from "./App";
import Auth from "./outlets/Auth";
import AllProducts from "./components/Major/AllProducts";
import ProductPage from "./outlets/ProductPage";
// import ShoppingCart from "./outlets/ShoppingCart"; Removed in favor of Checkout 4/19/2025 - Ivan
import AdminApp from "./AdminApp";
import AdminHome from "./components/AdminHome";
import Home from "./outlets/Home";
import ErrorPage from "./outlets/ErrorPage";
import Whatever from "./outlets/Whatever";
import Logout from "./components/Logout";
import Checkout from "./outlets/Checkout";
const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "Auth", element: <Auth /> },
      { path: "products", element: <AllProducts /> },
      { path: "products/:productName", element: <ProductPage /> },
      // { path: "ShoppingCart", element: <ShoppingCart /> }, Removed in favor of Checkout 4/19/2025 - Ivan
      { path: "Logout", element: <Logout /> },
      { path: "Checkout", element: <Checkout /> },
    ],
  },
  {
    path: "Admin",
    element: <AdminApp />,
    children: [{ index: true, element: <AdminHome /> }],
  },
  {
    path: "/Whatever",
    element: <Whatever />,
  },
];

export default routes;
