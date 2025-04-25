import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ProductCard from "./components/product/ProductCard"

const Cart = () => {
    const [user , setUser] = useState({})
    const [products , setProducts ] = useState([])
    const navigate = useNavigate()  

    useEffect(() => {
        getUser()
    },[])

    const getUser = async() => {
        const userId = localStorage.getItem('user_id')
        try{
            const response = await fetch(`http://localhost:3000/users/${userId}`)
            if(!response.ok){
                throw new Error('could not fetch user')
            }
            const data = await response.json()
            setUser(data)
            getProducts(data.saved_products)
        }catch(error){
            console.log(error);
        }
    }
    const deleteProduct = async(id) => {
        const tempUser = {...user}
        tempUser.saved_products = tempUser.saved_products.filter(pid => pid != id)
        try {
            const response = await fetch(`http://localhost:3000/users/${user.id}`,{
                method : 'PUT',
                headers : {
                    'Content-type' : "application/json"
                },
                body : JSON.stringify(tempUser)
            })
            if(!response.ok){
                throw new Error('could not delete')
            }
            setUser(tempUser)
            getProducts(tempUser.saved_products)
        } catch (error) {
            console.log(error);
        }
    }

    const getProducts = async(ids) => {
        const prdcts = []
        if(ids && ids.length > 0){
            for (const id of ids) {
                try{
                    const response = await fetch(`http://localhost:3000/products/${id}`)
                if(!response.ok){
                    throw new Error('could not fetch user')
                }
                const data = await response.json()
                prdcts.push(data)
                
            }catch(error){
                console.log(error);
            }
        }

    }
    setProducts(prdcts)
    }

    return(
        <>
            <div className="bg-gray-100 min-h-screen p-6">
                <h1 className="font-bold text-4xl text-center text-gray-800 mb-6">Your Shopping Cart</h1>
                <div className="flex justify-center mb-4">
                    <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300" onClick={() => navigate('/products')}>Back to Products</button>
                </div>
                <div className="flex flex-wrap justify-center">
                    {
                        products.length !== 0 ? products.map(product => (
                            <div key={product.id} className="m-4">
                                <ProductCard 
                                  product={product} 
                                  onDelete={deleteProduct} 
                                />
                            </div>
                        )) : (
                            <span className="text-2xl text-gray-600">No products in your cart</span>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Cart