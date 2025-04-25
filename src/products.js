import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { productAction } from "./store/productSlice";
import ProductCard from "./components/product/ProductCard";

const Product = () => {
  const navigate = useNavigate();
  const [products , setProducts] = useState([])
  const product = useSelector((state) => state.product.products);
  let checkedCategory = useSelector(state => state.product.checkedCategory)
  let sortByOptions = useSelector(state => state.product.sortByOptions)
  const dispatch = useDispatch()
  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    if (product.length === 0) {
      getProductFromDB();
    } else {
      let products = sortProducts(sortByOptions, checkedCategory);
      setProducts(products);
    }
  };

  const getProductFromDB = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      setProducts(data);
      dispatch(productAction.addProducts(data))
    } catch (error) {
      console.log(error);
    }
  };

  const onLogout = () => {
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  const onSelectFilter = (e) => {
    dispatch(productAction.addSelectedFilter(e.target.value))
    let product = sortProducts( e.target.value , checkedCategory)
    setProducts(product);
  };

  const onCheckedCategory = (e) => {
    let checked = [...checkedCategory];
    if (e.target.checked) {
      dispatch(productAction.addCheckedCategory(e.target.value));
      checked.push(e.target.value);
    } else {
      dispatch(productAction.removeCheckedCategory(e.target.value));
      checked = checkedCategory.filter((p) => p !== e.target.value);
    }
    const demoData = sortProducts(sortByOptions, checked);
    if (demoData.length === 0) {
      setProducts(product);
    } else {
      setProducts(demoData);
    }
  }

  const sortProducts = (sortBy, checked) => {
    let products = [];
    if (checked.length === 0) {
      products = [...product];
    }
    product.forEach((p) => {
      checked.forEach((ele) => {
        if (p.category === ele) {
          products.push(p);
        }
      });
    });
    switch (sortBy) {
      case "":
        products.sort((a, b) => a.id - b.id);
        break;
      case "plowtohigh":
        products.sort((a, b) => a.price - b.price);
        break;
      case "phightolow":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rlowtohigh":
        products.sort((a, b) => a.rating - b.rating);
        break;
      case "rhightolow":
        products.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return products;
  };

  const isChecked = (value) => {
    return checkedCategory.includes(value);
  };

  return (
    <>
      <h1 className="font-bold h-16 text-3xl text-center bg-gray-300">
        Products
      </h1>
      <nav className="h-16 text-xl flex gap-8 justify-end pr-24 bg-gray-400">
        <select
          onChange={onSelectFilter}
          value={sortByOptions}
          className="w-60 mt-3 h-10 bg-transparent border border-black rounded"
        >
          <option value="">select</option>
          <option value="plowtohigh">Price low to high</option>
          <option value="phightolow">Price high to low</option>
          <option value="rlowtohigh">Rating low to high</option>
          <option value="rhightolow">Rating high to low</option>
        </select>
        {localStorage.getItem("user_id") !== "temp" && (
          <button
            className="border border-black w-28 h-10 mt-3 hover:bg-black hover:text-white rounded"
            onClick={onLogout}
          >
            Logout
          </button>
        )}
        {localStorage.getItem("user_id") !== "temp" && (
          <button
            className="border border-black w-24 h-10 mt-3 hover:bg-black hover:text-white rounded"
            onClick={() => navigate("/cart")}
          >
            Cart
          </button>
        )}
      </nav>
      <div className="flex">
        <aside className="border border-black pr-28 pl-10 pt-4  bg-gray-300 h-screen" >
          <h2 className="text-2xl mb-10 font-extrabold">Category</h2>
          <ul className="flex-col">
            <li>
              <label className="flex gap-3 mt-3">
                <input
                  type="checkbox"
                  checked={isChecked("Appliances")}
                  value="Appliances"
                  onChange={onCheckedCategory}
                />
                Appliances
              </label>
            </li>
            <li>
              <label className="flex gap-3 mt-3">
                <input
                  type="checkbox"
                  checked={isChecked("Audio")}
                  value="Audio"
                  onChange={onCheckedCategory}
                />
                Audio
              </label>
            </li>
            <li>
              <label className="flex gap-3 mt-3">
                <input
                  type="checkbox"
                  checked={isChecked("Wearables")}
                  value="Wearables"
                  onChange={onCheckedCategory}
                />
                Wearables
              </label>
            </li>
            <li>
              <label className="flex gap-3 mt-3">
                <input
                  type="checkbox"
                  checked={isChecked("Electronics")}
                  value="Electronics"
                  onChange={onCheckedCategory}
                />
                Electronics
              </label>
            </li>
            <li>
              <label className="flex gap-3 mt-3">
                <input
                  type="checkbox"
                  checked={isChecked("Gaming")}
                  value="Gaming"
                  onChange={onCheckedCategory}
                />
                Gaming
              </label>
            </li>
          </ul>
        </aside>
        <div className="flex flex-wrap justify-center">
          {products.length > 0 &&
            products.map((product) => (
              <div key={product.id} className="m-4">
                <ProductCard product={product} />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Product;
