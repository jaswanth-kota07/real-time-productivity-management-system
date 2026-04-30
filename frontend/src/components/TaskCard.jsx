import React from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../store/slices/taskSlice';
import { motion } from 'framer-motion';
import { Trash2, CheckCircle2, Clock, Calendar, Tag } from 'lucide-react';

const TaskCard = ({ task }) => {
    const dispatch = useDispatch();

    const isOverdue = new Date(task.deadline) < new Date() && task.status !== 'Completed';
    
    const calculatePriorityValue = () => {
        if (task.status === 'Completed') return 0;
        const now = new Date();
        const deadline = new Date(task.deadline);
        const diff = deadline - now;
        const hours = diff / (1000 * 60 * 60);
        
        if (diff < 0) return Math.floor(100 + Math.abs(hours)); // Overdue starting from 100
        return Math.max(1, Math.floor(100 - hours)); // Approaches 100
    };

    const priorityValue = calculatePriorityValue();

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
        if (isOverdue) return '#ef4444';
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
            style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem', 
                borderLeft: `4px solid ${getStatusColor(task.status)}`,
                background: isOverdue ? 'rgba(239, 68, 68, 0.03)' : 'var(--card-bg)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '4px 8px', 
                        background: 'rgba(79, 70, 229, 0.08)', 
                        color: 'var(--primary)', 
                        borderRadius: '4px',
                        fontWeight: '700',
                        textTransform: 'uppercase'
                    }}>
                        {task.category}
                    </span>
                    {task.status !== 'Completed' && (
                        <span style={{ 
                            fontSize: '0.7rem', 
                            padding: '4px 8px', 
                            background: isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 0, 0, 0.05)', 
                            color: isOverdue ? '#ef4444' : 'var(--text-main)', 
                            borderRadius: '4px',
                            fontWeight: '700'
                        }}>
                            P: {priorityValue}
                        </span>
                    )}
                </div>
                <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '4px', transition: 'color 0.2s' }}>
                    <Trash2 size={18} onMouseOver={(e) => e.target.style.color = '#ef4444'} onMouseOut={(e) => e.target.style.color = '#cbd5e1'} />
                </button>
            </div>

            <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: task.status === 'Completed' ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
                    {task.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {task.description}
                </p>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <Calendar size={14} />
                    {new Date(task.deadline).toLocaleDateString()}
                </div>
                
                <button 
                    onClick={handleStatusChange}
                    style={{ 
                        background: 'none', 
                        border: `1px solid ${getStatusColor(task.status)}20`, 
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
