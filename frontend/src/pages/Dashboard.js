import React, {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import TaskList from '../components/TaskList.js';
import TaskForm from '../components/TaskForm.js';

function Dashboard() {
    const [showCreateForm,setShowCreateForm] = useState(false);
    const [users,setUsers] = useState([]);
    const [refreshKey,setRefreshKey] = useState(0);
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if(!token || !user) {
            navigate('/login');
        }
        
        if(user?.role === 'admin') {
            fetchUsers();
        }
    }, []);

    const fetchUsers = async() => {
        try{
            const res = await axios.get('http://localhost:5000/api/auth/users', {
                headers: {'auth-token': token}
            });
            setUsers(res.data);
        }catch(err){
            console.log('Error fetching users');
        }
    };

    const handleDeleteUser = async(userId) => {
        if(window.confirm('Are you sure you want to delete this user?')) {
            try{
                await axios.delete(`http://localhost:5000/api/auth/users/${userId}`, {
                    headers: {'auth-token': token}
                });
                alert('User deleted successfully');
                fetchUsers();
            }catch(err){
                alert(err.response?.data?.message || 'Error deleting user');
            }
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <button 
                    onClick={() => setShowCreateForm(true)}
                    className="btn-create"
                >
                    + Create New Task
                </button>
            </div>
            
            {user?.role === 'admin' && (
                <div className="admin-section">
                    <h2>User Management</h2>
                    <div className="users-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>{u.role}</td>
                                        <td>
                                            {u._id !== user.id && (
                                                <button 
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    style={{color:'red'}}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            <div className="tasks-section">
                <h2>Tasks</h2>
                <TaskList key={refreshKey} />
            </div>
            
            {showCreateForm && (
                <TaskForm 
                    task={null}
                    onClose={() => setShowCreateForm(false)}
                    onUpdate={() => {
                        setRefreshKey(refreshKey + 1);
                        setShowCreateForm(false);
                    }}
                />
            )}
        </div>
    );
}

export default Dashboard;
