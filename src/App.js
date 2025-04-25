import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import LoginPage from "./components/auth/LoginPage";
import ProductPage from "./components/product/ProductPage";
import ProductDetailPage from "./components/product/ProductDetailPage";
import CartPage from "./components/cart/CartPage";
import { fetchCurrentUser } from "./store/slices/authSlice";
import { isAuthenticated } from "./utils/auth";

// Protected route wrapper
const RequireAuth = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/products" />,
    errorElement: <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/products",
    element: <ProductPage />,
  },
  {
    path: "/products/:id",
    element: <ProductDetailPage />,
  },
  {
    path: "/cart",
    element: (
      <RequireAuth>
        <CartPage />
      </RequireAuth>
    ),
  },
]);

const App = () => {
  const dispatch = useDispatch();
  
  // Check if user is authenticated on app mount
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);
  
  return <RouterProvider router={router} />;
};

export default App;
