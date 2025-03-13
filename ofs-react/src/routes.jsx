import App from "./App";
import Auth from "./components/Auth";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [{ path: "Auth", element: <Auth /> }],
  },
];

export default routes;
