import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function EnterCode() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSendCode = () => {
        console.log("recovery code sent");
    };
    const handleEnterCode = () => {
        console.log("code entered");
        navigate("reset-password", { replace: true });
    }

    return (
        <form className='authForm'>
            <h2>Recover Password</h2>
            <input 
                className="credInput"
                id='inper'
                type='text'
                placeholder='Code'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleEnterCode}>Submit</button>
            <button onClick={handleSendCode}>Send code again</button>
        </form>
    );
}

export default EnterCode;