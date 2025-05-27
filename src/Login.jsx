import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './Auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.detail || 'Login failed');
                return;
            }
            const data = await response.json();
            login(data.user); // 로그인 정보 저장
            localStorage.setItem('user', JSON.stringify(data.user)); // 로컬 스토리지에 사용자 정보 저장
            setEmail('');
            setPassword('');
            navigate('/'); // 로그인 성공 시 홈으로 이동
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Login</h2>
                <form className="auth-form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="auth-button">Login</button>
                    {error && <div className="auth-error">{error}</div>}
                </form>
            </div>
        </div>
    );
}

export default Login;