import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

function Register() {
    const [formData,setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [error,setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        try{
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        }catch(err){
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {error && <p style={{color:'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="name"
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input 
                    type="password" 
                    name="password"
                    placeholder="Password (min 6 chars)" 
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Register</button>
            </form>
            <p>Already have account? <a href="/login">Login</a></p>
        </div>
    );
}

export default Register;
