import { useState } from 'react';
import { useAuth } from "../context/AuthContext";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useAuth();

    async function handleLogin() {
        await login("Alice", "password123");
    };

    return (
        <div className='authForm'>
            <h2>Login</h2>
            <input
                className="inputField"
                id='inpul'
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="inputField"
                id='inppl'
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;