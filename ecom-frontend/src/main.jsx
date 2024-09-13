import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./store";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./Components/ErrorPage";
import HomePage from "./Pages/Home/HomePage";
import Contact from "./Pages/ContactUs/ContactPage.jsx";
import Catalogue from "./Pages/Catalogue/Catalogue";
import Cart from "./Pages/Cart/Cart.jsx";
import ProductPage from "./Pages/ProductPage/ProductPage";
import AllProductPage from "./Pages/AllProductPage/AllProductPage.jsx";
import PolicyPage from "./Pages/PolicyPage/PolicyPage.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import Order from "./Pages/Profile/Order.jsx";
import Address from "./Pages/Profile/Address.jsx";
import OrderDetails from "./Pages/Profile/OrderDetails.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "catalogue",
        element: <Catalogue />,
      },
      {
        path: "product",
        element: <ProductPage />,
      },
      {
        path: "allproduct",
        element: <AllProductPage />,
      },
      {
        path: "policy/:policyName",
        element: <PolicyPage />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "orders",
        element: <Order />,
      },
      {
        path: "address",
        element: <Address />,
      },
      { path: "contact", element: <Contact /> },
      // { path: "orders/orderdetail", element: <OrderDetails /> },
      { path:"/orderdetail/:orderId", element:<OrderDetails />} 
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
