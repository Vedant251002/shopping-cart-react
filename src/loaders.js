import { redirect } from "react-router-dom"

export const checkLogin = () => {
    if(!localStorage.getItem('user_id')){
        return redirect('/login')
    }
    return null
}

export const loginLoader = () => {
    if(localStorage.getItem('user_id') && !localStorage.getItem('user_id') == 'temp'){
        return redirect('/products')
    }
    return null
}