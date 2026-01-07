import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        console.log('Resetting password');
        navigate("/auth/login", { replace: true });
    };

    return (
        <form className='authForm'>
            <h2>Set New Password</h2>
            <input
                className="credInput"
                id='inppres'
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
                className="credInput"
                id='inppcres'
                type="password"
                placeholder="Confirm Password"
                value={confPassword}
                onChange={(e) => setConfPassword(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
        </form>
    );
} 

export default ResetPassword;