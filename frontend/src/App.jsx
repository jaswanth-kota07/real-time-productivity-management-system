import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { taskCreated, taskUpdated, taskDeleted } from './store/slices/taskSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';

const socket = io('http://localhost:5000');

const PrivateRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    return token ? children : <Navigate to="/login" />;
};

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('task_created', (task) => {
            dispatch(taskCreated(task));
        });

        socket.on('task_updated', (task) => {
            dispatch(taskUpdated(task));
        });

        socket.on('task_deleted', (id) => {
            dispatch(taskDeleted(id));
        });

        return () => {
            socket.off('task_created');
            socket.off('task_updated');
            socket.off('task_deleted');
        };
    }, [dispatch]);

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                    path="/" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />
            </Routes>
        </Router>
    );
};

export default App;
