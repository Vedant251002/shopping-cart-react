import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Cart = () => {
    const [user , setUser] = useState({})
    const [products , setProducts ] = useState([])
    const navigate = useNavigate()  

    useEffect(() => {
        getUser()
        // getProducts()
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
            // const prodData = await getProducts(data.saved_products)
            // setProducts(prodData)
            // console.log(products);
        }catch(error){
            console.log(error);
        }
    }
    const deleteProduct = async(id) => {
        const tempUser = {...user}
        tempUser.saved_products = tempUser.saved_products.filter(pid => pid != id)
        console.log(tempUser);
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
            // console.log(tempUser);
            getProducts(tempUser.saved_products)
            // setProducts(tempUser.saved_products)
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
    
    
    return(<>
    <div>
        <h1 className="font-bold h-16 text-3xl text-center bg-gray-300">Cart</h1>
    </div>
    <div className="flex"><div className="w-1/4 text-center text-3xl mt-20"><h1>Name : {user.name}</h1>
    <button className="border border-solid border-black ml-12 w-24 h-8 text-xl mt-8  hover:bg-black hover:text-white " onClick={() => navigate('/products')}>Back</button>
    </div>
    <div className=" flex felx-wrap mt-10">
        {
            products.length != 0 && products.map(product => {
                return( 
                    
               <div key={product.id} className="flex flex-col justify-between m-4 p-4 border text-center border-black border-solid h-60 w-60 ">
                        <h2 className="font-bold">{product.name}</h2>
                        <p>Price: {product.price}</p>
                        <p>Rating: {product.rating}</p>
                        <button className="border border-solid border-black ml-12 w-24 h-10 mt-3  hover:bg-black hover:text-white " onClick={() => deleteProduct(product.id)}>Delete</button>
                    </div>
                
                )
            })
        }
        {products.length == 0 && <span className="text-2xl ml-40 mt-20">No products in your cart</span>}
        </div></div>
    </>)
}

export default Cart