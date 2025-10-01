import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import TaskForm from './TaskForm.js';

function TaskItem({task,onDelete,onStatusToggle,onPriorityChange,onUpdate}) {
    const [showEdit,setShowEdit] = useState(false);
    const navigate = useNavigate();
    
    const priorityColors = {
        high: '#d32f2f',
        medium: '#f57c00',
        low: '#388e3c'
    };

    return (
        <>
            <div className="task-item">
                <div className="task-header">
                    <h4 style={{textDecoration: task.status === 'completed' ? 'line-through' : 'none'}}>
                        {task.title}
                    </h4>
                    <span className={`status-badge ${task.status}`}>
                        {task.status}
                    </span>
                </div>
                
                <p className="task-due">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                <p className="task-assigned">Assigned to: {task.assignedTo?.name || 'Unknown'}</p>
                
                <div className="task-actions">
                    <button onClick={() => navigate(`/task/${task._id}`)}>View</button>
                    <button onClick={() => setShowEdit(true)}>Edit</button>
                    <button onClick={() => onStatusToggle(task._id)}>
                        {task.status === 'pending' ? 'Complete' : 'Reopen'}
                    </button>
                    <button onClick={() => onDelete(task._id)} style={{color:'red'}}>Delete</button>
                </div>
                
                <div className="priority-actions">
                    <small>Move to:</small>
                    <select 
                        value={task.priority} 
                        onChange={(e) => onPriorityChange(task._id, e.target.value)}
                        style={{color: priorityColors[task.priority]}}
                    >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>
            
            {showEdit && (
                <TaskForm 
                    task={task}
                    onClose={() => setShowEdit(false)}
                    onUpdate={onUpdate}
                />
            )}
        </>
    );
}

export default TaskItem;
