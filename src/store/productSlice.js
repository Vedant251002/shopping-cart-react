import { createSlice } from "@reduxjs/toolkit";

const ProductSlice = createSlice({
    name : 'products',
    initialState : {
        products : [],
        checkedCategory : [],
        sortByOptions : ''
    },
    reducers : {
        addProducts : (state,action) => {
            state.products = action.payload
        },
        addCheckedCategory : (state,action) => {
            state.checkedCategory.push(action.payload)
        },
        removeCheckedCategory : (state,action) => {
            state.checkedCategory = state.checkedCategory.filter( cat => cat != action.payload)
        },
        addSelectedFilter : (state ,action) => {
            state.sortByOptions = action.payload
        }
    }
})

export const productAction = ProductSlice.actions
export default ProductSlice