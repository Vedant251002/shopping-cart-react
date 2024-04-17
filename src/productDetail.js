import { useEffect, useState } from "react"
import { redirect, useNavigate, useParams } from "react-router-dom"

const ProductDetail = () => {
    const params = useParams()
    const [product , setProduct] = useState({})
    const [user , setUser] =  useState({})
    const navigate = useNavigate()
    useEffect(()=>{
        const id = Number(params.id)
        if(id &&  id !== NaN){
            getProduct(id)
            userData()
        }
    },[])

    const getProduct = async( id ) => {
        try {
            const response = await fetch(`http://localhost:3000/products?id=${id}`)
            if(!response.ok){
                throw new Error('could not fetch data of product');
            }
            const data = await response.json()
            if(data){
                setProduct(data[0])
            }
        } catch (error) {
            console.log(error);
        }
    }

    const addToCart = () => {
        const updatedUser = {...user}
        updatedUser.saved_products.push(+params.id)
        addToDatabase(updatedUser)
        console.log(updatedUser);
    }
    
    const addToDatabase = async(user) => {
        const userId  = localStorage.getItem('user_id');
        if(userId == 'temp'){
            return
        }
        try {
            const response = await fetch(`http://localhost:3000/users/${userId}`,{
                method : 'PUT',
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify(user)
            })
            if(!response.ok){
                throw new Error('Could not update product')
            }
            setUser(user)
        } catch (error) {
            console.log(error);
        }
    }

    const userData = async() => {
        try {
            const userId  = localStorage.getItem('user_id')
            if(userId == 'temp'){
                return 
            }
            const response = await fetch(`http://localhost:3000/users?id=${userId}`)
            if(!response.ok){
                throw new Error()
            }
            const data = await response.json()
            setUser(data[0])
            
        } catch (error) {
            console.log(error);
        }
    }
    
    const checkProductInCart = () => {
        if(user.saved_products){
            const result =  user.saved_products.includes( +params.id)
            if(result){
                return <button className="border border-solid border-black ml-12 w-24 h-10 mt-3  hover:bg-black hover:text-white " onClick={() => navigate('/cart')}> Go to cart</button>

            }
            return  <button className="border border-solid border-black ml-12 w-24 h-10 mt-3  hover:bg-black hover:text-white " onClick={() => addToCart()}>Add to cart</button>
        }else{
            return  <button className="border border-solid border-black ml-12 w-24 h-10 mt-3  hover:bg-black hover:text-white " onClick={() => navigate('/login')}>Add to cart</button>
        }
    }
    return (
        <>
            <h1 className="font-bold h-16 text-3xl text-center bg-gray-300" >Product</h1>
            {product && <div className="text-lg ml-10 mt-10">
                <div className="text-4xl"><label>Name : </label><span>{product.name}</span></div>
                <div className="mt-8"><label>Description : </label><span>{product.description}</span></div>
                <div className="mt-4"><label>Price : </label><span>{product.price}</span></div>
                <div className="mt-2"><label>Rating : </label><span>{product.rating}</span></div>
                </div>}

                <button className=" border border-solid border-black ml-12 w-24 h-10 mt-20  hover:bg-black hover:text-white " onClick={() => navigate('/products')}> Go Back</button>
                { checkProductInCart() }
        </>
    )
}

export default ProductDetail