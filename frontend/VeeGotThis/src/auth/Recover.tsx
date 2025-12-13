import { useState } from 'react';

function Recover() {
    const [email, setEmail] = useState('');

    const handleRecover = () => {
        console.log("recovery code sent");
    };

    return (
        <form className='authForm'>
            <h2>Recover Password</h2>
            <input 
                id='lfi1'
                type='text'
                placeholder='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleRecover}>Send code</button>
        </form>
    );
}

export default Recover;