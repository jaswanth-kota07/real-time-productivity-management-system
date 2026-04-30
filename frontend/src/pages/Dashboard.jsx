import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/slices/taskSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Clock, Calendar, Filter, Tag } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import StatsDashboard from '../components/StatsDashboard';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.tasks);
    
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        category: 'Work',
        deadline: '',
    });

    const calculatePriority = (task) => {
        if (task.status === 'Completed') return -1;
        const now = new Date();
        const deadline = new Date(task.deadline);
        const diff = deadline - now;
        const hours = diff / (1000 * 60 * 60);
        
        if (diff < 0) return 1000000 + Math.abs(hours); // Overdue
        return 100000 - hours; // Approaches deadline
    };

    const sortedTasks = [...items].sort((a, b) => {
        const priorityA = calculatePriority(a);
        const priorityB = calculatePriority(b);
        if (priorityA !== priorityB) return priorityB - priorityA;
        return new Date(a.createdAt) - new Date(b.createdAt); // Tie-breaker: earlier first
    });

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

    const handleCreateTask = (e) => {
        e.preventDefault();
        dispatch(createTask(newTask));
        setShowModal(false);
        setNewTask({ title: '', description: '', category: 'Work', deadline: '' });
    };

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>My Tasks</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your daily productivity</p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={20} />
                    Add Task
                </button>
            </header>

            <StatsDashboard />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                <AnimatePresence>
                    {sortedTasks.map((task) => (
                        <TaskCard key={task._id} task={task} />
                    ))}
                </AnimatePresence>
            </div>

            {items.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <h3>No tasks yet. Create one to get started!</h3>
                </div>
            )}

            {/* Modal for adding task */}
            {showModal && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', 
                    alignItems: 'center', zIndex: 1000, padding: '20px' 
                }}>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-card" 
                        style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}
                    >
                        <h2 style={{ marginBottom: '1.5rem' }}>Create New Task</h2>
                        <form onSubmit={handleCreateTask}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Title</label>
                                <input 
                                    className="input-field" 
                                    value={newTask.title} 
                                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                    placeholder="Task title..."
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</label>
                                <textarea 
                                    className="input-field" 
                                    style={{ height: '100px', resize: 'none' }}
                                    value={newTask.description} 
                                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                    placeholder="Tell more about the task..."
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Category</label>
                                    <select 
                                        className="input-field" 
                                        value={newTask.category}
                                        onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                                    >
                                        <option value="Work">Work</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Shopping">Shopping</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Deadline</label>
                                    <input 
                                        type="date"
                                        className="input-field" 
                                        value={newTask.deadline}
                                        onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" className="input-field" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Create Task</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
