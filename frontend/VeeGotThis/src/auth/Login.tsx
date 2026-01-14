import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        login("user123"); // replace with API response
        const res = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: "Alice", password: "password123" }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail);
        }

        const data = await res.json();
        console.log("login successful", data.status);
        login(data.username); // replace with actual user data from response
        navigate("/", { replace: true });
    };

    return (
        <form className='authForm' onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
                className="credInput"
                id='inpul'
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="credInput"
                id='inppl'
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
}

export default Login;