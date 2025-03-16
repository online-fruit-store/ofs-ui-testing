import App from "./App";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Admin from "./components/Admin";
const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "Auth", element: <Auth /> },
      { path: "Admin", element: <Admin /> },
    ],
  },
];

export default routes;
