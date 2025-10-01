import React, {useState,useEffect} from 'react';
import axios from 'axios';
import TaskItem from './TaskItem.js';

function TaskList() {
    const [tasks,setTasks] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    const [totalPages,setTotalPages] = useState(1);
    const [loading,setLoading] = useState(true);
    
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchTasks();
    }, [currentPage]);

    const fetchTasks = async() => {
        setLoading(true);
        try{
            const res = await axios.get(`http://localhost:5000/api/tasks?page=${currentPage}&limit=10`, {
                headers: {'auth-token': token}
            });
            setTasks(res.data.tasks);
            setTotalPages(res.data.totalPages);
        }catch(err){
            console.log('Error fetching tasks');
        }
        setLoading(false);
    };

    const handleDelete = async(id) => {
        if(window.confirm('Are you sure you want to delete this task?')) {
            try{
                await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                    headers: {'auth-token': token}
                });
                fetchTasks();
            }catch(err){
                alert('Error deleting task');
            }
        }
    };

    const handleStatusToggle = async(id) => {
        try{
            await axios.patch(`http://localhost:5000/api/tasks/${id}/status`, {}, {
                headers: {'auth-token': token}
            });
            fetchTasks();
        }catch(err){
            alert('Error updating status');
        }
    };

    const handlePriorityChange = async(id,priority) => {
        try{
            await axios.patch(`http://localhost:5000/api/tasks/${id}/priority`, {priority}, {
                headers: {'auth-token': token}
            });
            fetchTasks();
        }catch(err){
            alert('Error updating priority');
        }
    };

    const groupedTasks = {
        high: tasks.filter(t => t.priority === 'high'),
        medium: tasks.filter(t => t.priority === 'medium'),
        low: tasks.filter(t => t.priority === 'low')
    };

    if(loading) return <div>Loading tasks...</div>;

    return (
        <div className="task-list-container">
            <div className="priority-columns">
                <div className="priority-column" style={{backgroundColor: '#ffebee'}}>
                    <h3 style={{color: '#d32f2f'}}>High Priority</h3>
                    {groupedTasks.high.map(task => (
                        <TaskItem 
                            key={task._id} 
                            task={task}
                            onDelete={handleDelete}
                            onStatusToggle={handleStatusToggle}
                            onPriorityChange={handlePriorityChange}
                            onUpdate={fetchTasks}
                        />
                    ))}
                </div>
                
                <div className="priority-column" style={{backgroundColor: '#fff8e1'}}>
                    <h3 style={{color: '#f57c00'}}>Medium Priority</h3>
                    {groupedTasks.medium.map(task => (
                        <TaskItem 
                            key={task._id} 
                            task={task}
                            onDelete={handleDelete}
                            onStatusToggle={handleStatusToggle}
                            onPriorityChange={handlePriorityChange}
                            onUpdate={fetchTasks}
                        />
                    ))}
                </div>
                
                <div className="priority-column" style={{backgroundColor: '#e8f5e9'}}>
                    <h3 style={{color: '#388e3c'}}>Low Priority</h3>
                    {groupedTasks.low.map(task => (
                        <TaskItem 
                            key={task._id} 
                            task={task}
                            onDelete={handleDelete}
                            onStatusToggle={handleStatusToggle}
                            onPriorityChange={handlePriorityChange}
                            onUpdate={fetchTasks}
                        />
                    ))}
                </div>
            </div>
            
            <div className="pagination">
                <button 
                    onClick={() => setCurrentPage(currentPage-1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                    onClick={() => setCurrentPage(currentPage+1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default TaskList;
