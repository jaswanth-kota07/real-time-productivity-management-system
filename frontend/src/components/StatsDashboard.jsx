import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, List, Activity, PieChart } from 'lucide-react';

const StatsDashboard = () => {
    const { items } = useSelector((state) => state.tasks);

    const totalTasks = items.length;
    const completedTasks = items.filter(t => t.status === 'Completed').length;
    const pendingTasks = totalTasks - completedTasks;
    
    // Calculate tasks completed today
    const today = new Date().setHours(0, 0, 0, 0);
    const completedToday = items.filter(t => 
        t.status === 'Completed' && new Date(t.updatedAt).setHours(0, 0, 0, 0) === today
    ).length;

    // Most active category
    const categories = items.reduce((acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1;
        return acc;
    }, {});
    
    const mostActiveCategory = Object.keys(categories).length > 0 
        ? Object.entries(categories).sort((a, b) => b[1] - a[1])[0][0]
        : 'N/A';

    const stats = [
        { label: 'Total Tasks', value: totalTasks, icon: <List size={20} />, color: '#6366f1' },
        { label: 'Completed', value: completedTasks, icon: <CheckCircle size={20} />, color: '#10b981' },
        { label: 'Pending', value: pendingTasks, icon: <Clock size={20} />, color: '#f59e0b' },
        { label: 'Done Today', value: completedToday, icon: <Activity size={20} />, color: '#8b5cf6' },
    ];

    return (
        <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {stats.map((stat, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card"
                        style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}
                    >
                        <div style={{ 
                            padding: '0.8rem', 
                            background: `${stat.color}20`, 
                            borderRadius: '12px', 
                            color: stat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>{stat.label}</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {totalTasks > 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ marginTop: '1.5rem', padding: '1rem 1.5rem', borderRadius: '12px', background: '#ffffff', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'var(--shadow-sm)' }}
                >
                    <PieChart size={16} color="var(--primary)" />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Insight: Your most active category is <strong style={{ color: 'var(--text-main)' }}>{mostActiveCategory}</strong>. 
                        {completedToday > 0 ? ` You've completed ${completedToday} tasks today! Great job!` : " Let's get some tasks done today!"}
                    </span>
                </motion.div>
            )}
        </div>
    );
};

export default StatsDashboard;
