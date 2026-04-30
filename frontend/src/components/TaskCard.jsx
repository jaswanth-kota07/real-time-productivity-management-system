import React from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../store/slices/taskSlice';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle2, Clock, Calendar, Tag } from 'lucide-react';

const TaskCard = ({ task }) => {
    const dispatch = useDispatch();

    const handleStatusChange = () => {
        const nextStatus = task.status === 'Pending' ? 'In Progress' : task.status === 'In Progress' ? 'Completed' : 'Pending';
        dispatch(updateTask({ id: task._id, taskData: { status: nextStatus } }));
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            dispatch(deleteTask(task._id));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return '#10b981';
            case 'In Progress': return '#f59e0b';
            default: return '#6366f1';
        }
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card" 
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: `4px solid ${getStatusColor(task.status)}` }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '4px 8px', 
                    background: 'rgba(99, 102, 241, 0.1)', 
                    color: '#6366f1', 
                    borderRadius: '4px',
                    fontWeight: '700',
                    textTransform: 'uppercase'
                }}>
                    {task.category}
                </span>
                <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={18} />
                </button>
            </div>

            <div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: task.status === 'Completed' ? 'var(--text-muted)' : 'white', textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
                    {task.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {task.description}
                </p>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <Calendar size={14} />
                    {new Date(task.deadline).toLocaleDateString()}
                </div>
                
                <button 
                    onClick={handleStatusChange}
                    style={{ 
                        background: 'none', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        color: getStatusColor(task.status), 
                        padding: '6px 12px', 
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                    }}
                >
                    {task.status === 'Completed' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {task.status}
                </button>
            </div>
        </motion.div>
    );
};

export default TaskCard;
