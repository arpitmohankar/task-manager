import React, {useState,useEffect} from 'react';
import axios from 'axios';

function TaskForm({task, onClose, onUpdate}) {
    const [formData,setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        assignedTo: ''
    });
    const [users,setUsers] = useState([]);
    const [loading,setLoading] = useState(false);
    
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if(task) {
            setFormData({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate.split('T')[0],
                priority: task.priority,
                assignedTo: task.assignedTo._id || task.assignedTo
            });
        }
        
        if(currentUser.role === 'admin') {
            fetchUsers();
        }
    }, [task]);

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

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        
        try{
            let res;
            if(task) {
                res = await axios.put(`http://localhost:5000/api/tasks/${task._id}`, formData, {
                    headers: {'auth-token': token}
                });
            }else{
                res = await axios.post('http://localhost:5000/api/tasks', formData, {
                    headers: {'auth-token': token}
                });
            }
            
            alert(task ? 'Task updated!' : 'Task created!');
            onUpdate();
            onClose();
        }catch(err){
            alert('Error: ' + err.response?.data?.message);
        }
        setLoading(false);
    };

    return (
        <div className="task-form-overlay">
            <div className="task-form">
                <h3>{task ? 'Edit Task' : 'Create New Task'}</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="title"
                        placeholder="Task Title" 
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <textarea 
                        name="description"
                        placeholder="Task Description" 
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        required
                    />
                    <input 
                        type="date" 
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        required
                    />
                    <select name="priority" value={formData.priority} onChange={handleChange}>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                    </select>
                    
                    {currentUser.role === 'admin' && users.length > 0 && (
                        <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                            <option value="">Assign to...</option>
                            {users.map(user => (
                                <option key={user._id} value={user._id}>
                                    {user.name} ({user.email})
                                </option>
                            ))}
                        </select>
                    )}
                    
                    <div className="form-buttons">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Task'}
                        </button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TaskForm;
