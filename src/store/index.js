import { configureStore } from "@reduxjs/toolkit";
import ProductSlice from "./productSlice";

export default configureStore({
    reducer: {
        product : ProductSlice.reducer
    },
})