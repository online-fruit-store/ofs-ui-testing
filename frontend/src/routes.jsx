import App from "./App";
import Auth from "./outlets/Auth";
import AllProducts from "./components/Major/AllProducts";
import ProductPage from "./outlets/ProductPage";
import AdminApp from "./AdminApp";
import AdminHome from "./components/Admin/AdminHome";
import Home from "./outlets/Home";
import ErrorPage from "./outlets/ErrorPage";
import Whatever from "./outlets/Whatever";
import Logout from "./components/Logout";
import Checkout from "./outlets/Checkout"; // IMPORTANT: correct import!
import Receipt from "./outlets/Receipt";
import CheckoutInfo from "./outlets/CheckoutInfo";
import AdminAddProduct from "./components/Admin/AdminAddProduct";
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
      { path: "Logout", element: <Logout /> },
      { path: "Checkout", element: <Checkout /> },
      { path: "Receipt", element: <Receipt /> },
      { path: "Checkout/Processing", element: <CheckoutInfo /> },
    ],
  },
  {
    path: "Admin",
    element: <AdminApp />,
    children: [
      { index: true, element: <AdminHome /> },
      { path: "AddProduct", element: <AdminAddProduct /> },
    ],
  },
];

export default routes;
