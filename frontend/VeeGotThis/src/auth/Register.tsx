import { useState } from 'react';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password1, setPassword1] = useState('');

    const handleRegister = () => {
        console.log("Adding new user:", username)
    }

    return (
        <form className='authForm'>
            <h2>Register</h2>
            <input
                id='lfi1'
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                id='lfi1'
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                id='lfi1'
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