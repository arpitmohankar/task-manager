import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,password
            });
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        }catch(err){
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p style={{color:'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>Don't have account? <a href="/register">Register</a></p>
        </div>
    );
}

export default Login;
