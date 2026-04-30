import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { CheckCircle, LogOut } from 'lucide-react';

const Navbar = () => {
    const { token, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav style={{ 
            padding: '1.5rem 2rem', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontWeight: '800', fontSize: '1.4rem' }}>
                <CheckCircle color="#6366f1" size={28} />
                Agumentix
            </Link>

            {token && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{user?.email}</span>
                    <button 
                        onClick={handleLogout}
                        style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            color: '#ef4444', 
                            border: 'none', 
                            padding: '8px 16px', 
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: '600'
                        }}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
