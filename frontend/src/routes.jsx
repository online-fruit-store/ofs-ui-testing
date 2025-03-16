import App from "./App";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Admin from "./components/Admin";
import ProductPage from "./pages/ProductPage";
const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "Auth", element: <Auth /> },
      { path: "Admin", element: <Admin /> },
      { path: "products", element: <Home /> },
      { path: "products/:productName", element: <ProductPage /> },
    ],
  },
];

export default routes;
