import App from "./App";
import Auth from "./outlets/Auth";
import AllProducts from "./components/Major/AllProducts";
import ProductPage from "./outlets/ProductPage";
import AdminApp from "./AdminApp";
import AdminHome from "./components/Admin/AdminHome";
import Home from "./outlets/Home";
import ErrorPage from "./outlets/ErrorPage";
import Logout from "./components/Logout";
import Checkout from "./outlets/Checkout"; // IMPORTANT: correct import!
import Receipt from "./outlets/Receipt";
import CheckoutInfo from "./outlets/CheckoutInfo";
import AdminAddProduct from "./components/Admin/AdminAddProduct";
import OrderHistory from "./components/OrderHistory";
import OrderDetail from "./components/OrderDetail";
import AdminOrders from "./components/Admin/AdminOrders";
import AdminOrderDetail from "./components/Admin/AdminOrderDetail";
import UserManagement from "./components/Admin/UserManagement";
const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "Auth", element: <Auth /> },
      { path: "products", element: <AllProducts /> },
      { path: "products/:productId", element: <ProductPage /> },
      { path: "Logout", element: <Logout /> },
      { path: "Checkout", element: <Checkout /> },
      { path: "Receipt", element: <Receipt /> },
      { path: "Checkout/Processing", element: <CheckoutInfo /> },
      { path: "Orders", element: <OrderHistory /> },
      { path: "Orders/:orderId", element: <OrderDetail /> },
    ],
  },
  {
    path: "Admin",
    element: <AdminApp />,
    children: [
      { index: true, element: <AdminHome /> },
      { path: "AddProduct", element: <AdminAddProduct /> },
      { path: "Orders", element: <AdminOrders /> },
      { path: "Orders/:orderId", element: <AdminOrderDetail /> },
      { path: "Users", element: <UserManagement /> },
    ],
  },
];

export default routes;
