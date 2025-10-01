import React from 'react';
import {Link} from 'react-router-dom';

function Home() {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Task Management System</h1>
                <p>Organize your tasks efficiently with priority management</p>
                
                {user ? (
                    <div>
                        <h2>Welcome back, {user.name}!</h2>
                        <Link to="/dashboard">
                            <button className="btn-primary">Go to Dashboard</button>
                        </Link>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/login">
                            <button className="btn-primary">Login</button>
                        </Link>
                        <Link to="/register">
                            <button className="btn-secondary">Register</button>
                        </Link>
                    </div>
                )}
            </div>
            
            <div className="features">
                <h3>Features</h3>
                <ul>
                    <li>Create and manage tasks</li>
                    <li>Set priority levels (High, Medium, Low)</li>
                    <li>Track task status</li>
                    <li>Assign tasks to team members</li>
                    <li>Color-coded priority lists</li>
                </ul>
            </div>
        </div>
    );
}

export default Home;
