import React from 'react';
import {Link,useNavigate} from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">Task Manager</Link>
            </div>
            
            <div className="nav-menu">
                {user ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        {user.role === 'admin' && <Link to="/users">Users</Link>}
                        <span>Hi, {user.name}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
