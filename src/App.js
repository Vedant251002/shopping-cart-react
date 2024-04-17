import { createBrowserRouter,RouterProvider, Navigate } from "react-router-dom";
import Login from "./login";
import Product from "./products";
import {validUserLoader, checkLogin , loginLoader} from "./loaders";
import ProductDetail from "./productDetail";
import Cart from "./cart";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to='/login' />,
    errorElement: <Navigate to='/login' />,
  },
  {
    path: "/login",
    element: <Login />,
    // loader : () => validUserLoader(),
    loader :  () => loginLoader()
  }
  ,
  {
    path: "/products",
    element: <Product />,
    loader :  () => checkLogin()
  },
  {
    path : '/products/:id',
    element : <ProductDetail />,
    loader :  () => checkLogin()
  },
  {
    path : '/cart',
    element : <Cart />,
    // loader : () => validUserLoader(),
    loader :  () => checkLogin()
  }
]);


const App= () => {
  return (
      <RouterProvider router={router} />
  );
}
export default App;
