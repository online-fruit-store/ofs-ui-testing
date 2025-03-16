import App from "./App";
import Auth from "./pages/Auth";
import AllProducts from "./components/AllProducts";
import Admin from "./pages/Admin";
import ProductPage from "./pages/ProductPage";
const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <AllProducts /> },
      { path: "Auth", element: <Auth /> },
      { path: "Admin", element: <Admin /> },
      { path: "products", element: <AllProducts /> },
      { path: "products/:productName", element: <ProductPage /> },
    ],
  },
];

export default routes;
