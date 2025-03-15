import App from "./App";
import Auth from "./components/Auth";
import Home from "./components/Home";
const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "Auth", element: <Auth /> },
    ],
  },
];

export default routes;
