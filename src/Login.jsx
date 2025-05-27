import React, { useState } from 'react';
import './Auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        // 로그인 로직 추가
    };

    return (
        <div className="auth-page"> {/* 부모 컨테이너 추가 */}
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
                </form>
            </div>
        </div>
    );
}

export default Login;