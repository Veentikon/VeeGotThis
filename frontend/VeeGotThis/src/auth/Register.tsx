import { useState } from 'react';
import { apiFetch } from '../api/api';
// import { Email } from '@mui/icons-material';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');
    const [email, setEmail] = useState('');

    const handleRegister = async () => {
        const data = await apiFetch("/users", {
            method: "POST",
            body: JSON.stringify({ username: username, email: email, password: password })
        });

        if (`${data.status}`.startsWith("4")) {
            throw new Error(data.detail || "Registration failed");
        }
    };

    return (
        <form className='authForm'>
            <h2>Register</h2>
            <input
                className="credInput"
                id='inpureg'
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                className="credInput"
                id='inpureg'
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="credInput"
                id='inppreg'
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                className="credInput"
                id='inppcreg'
                type="password"
                placeholder="confirm password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
        </form>
    );
}

export default Register;