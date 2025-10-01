import React, {useState,useEffect} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import axios from 'axios';

function TaskDetail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [task,setTask] = useState(null);
    const [loading,setLoading] = useState(true);
    
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchTaskDetails();
    }, [id]);

    const fetchTaskDetails = async() => {
        try{
            const res = await axios.get(`http://localhost:5000/api/tasks/${id}`, {
                headers: {'auth-token': token}
            });
            setTask(res.data);
        }catch(err){
            alert('Error fetching task details');
            navigate('/dashboard');
        }
        setLoading(false);
    };

    const handleStatusToggle = async() => {
        try{
            const res = await axios.patch(`http://localhost:5000/api/tasks/${id}/status`, {}, {
                headers: {'auth-token': token}
            });
            setTask({...task, status: res.data.task.status});
            alert(res.data.message);
        }catch(err){
            alert('Error updating status');
        }
    };

    const handleDelete = async() => {
        if(window.confirm('Are you sure you want to delete this task?')) {
            try{
                await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                    headers: {'auth-token': token}
                });
                alert('Task deleted successfully');
                navigate('/dashboard');
            }catch(err){
                alert('Error deleting task');
            }
        }
    };

    const priorityColors = {
        high: '#d32f2f',
        medium: '#f57c00',
        low: '#388e3c'
    };

    if(loading) return <div>Loading task details...</div>;
    if(!task) return <div>Task not found</div>;

    return (
        <div className="task-detail-container">
            <button onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
            
            <div className="task-detail-card">
                <div className="task-header">
                    <h1>{task.title}</h1>
                    <span 
                        className="priority-badge" 
                        style={{backgroundColor: priorityColors[task.priority], color: 'white'}}
                    >
                        {task.priority.toUpperCase()}
                    </span>
                </div>
                
                <div className="task-info">
                    <div className="info-row">
                        <strong>Status:</strong>
                        <span className={`status ${task.status}`}>
                            {task.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                        </span>
                    </div>
                    
                    <div className="info-row">
                        <strong>Due Date:</strong>
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="info-row">
                        <strong>Assigned To:</strong>
                        <span>{task.assignedTo?.name} ({task.assignedTo?.email})</span>
                    </div>
                    
                    <div className="info-row">
                        <strong>Created By:</strong>
                        <span>{task.createdBy?.name}</span>
                    </div>
                    
                    <div className="info-row">
                        <strong>Created At:</strong>
                        <span>{new Date(task.createdAt).toLocaleString()}</span>
                    </div>
                </div>
                
                <div className="task-description">
                    <h3>Description</h3>
                    <p>{task.description}</p>
                </div>
                
                <div className="task-actions">
                    <button onClick={handleStatusToggle} className="btn-status">
                        {task.status === 'pending' ? 'Mark as Complete' : 'Reopen Task'}
                    </button>
                    {(user.role === 'admin' || task.assignedTo._id === user.id) && (
                        <>
                            <button onClick={() => navigate(`/dashboard?edit=${task._id}`)} className="btn-edit">
                                Edit Task
                            </button>
                            <button onClick={handleDelete} className="btn-delete">
                                Delete Task
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TaskDetail;
