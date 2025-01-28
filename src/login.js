import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const onLogin = async (e) => {
        e.preventDefault();
        const users = await dbCheck();
        if (users.length === 0) {
            setError("User not found");
            return;
        } else if (users.length > 0) {
            localStorage.setItem("user_id", users[0].id);
            navigate('/products');
        }
    };

    const dbCheck = async () => {
        try {
            const response = await fetch(`http://localhost:3000/users?name=${name}&password=${password}`);
            if (!response.ok) {
                throw new Error();
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    };

    const goToProducts = () => {
        localStorage.setItem('user_id', 'temp');
        navigate('/products');
    };

    return (
        <div className="flex flex-col items-center min-h-screen justify-center bg-blue-100">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-96">
                <h1 className="text-center text-2xl font-bold mb-5">Login</h1>
                <form onSubmit={onLogin}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <button className="bg-blue-500 ml-32 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Login
                    </button>
                </form>
                {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
                <a className="mt-4 text-center text-blue-500 cursor-pointer" onClick={goToProducts}>See products anyway</a>
            </div>
        </div>
    );
};

export default Login;