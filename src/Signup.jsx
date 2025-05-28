import React, { useState } from 'react';
import './Auth.css';
import { redirect } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('패스워드 불일치치');
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || '회원가입 실패패');
        return;
      }
      alert('회원가입 성공');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      redirect('/login');
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="auth-page"> {/* 부모 컨테이너 추가 */}
      <div className="auth-container">
        <h2>Signup</h2>
        <form className="auth-form" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">Signup</button>
          {error && <div className="auth-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default Signup;