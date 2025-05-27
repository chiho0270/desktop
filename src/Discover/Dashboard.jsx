import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import '../styles/common.css';
import './Dashboard.css';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user')); // 로컬 스토리지에서 사용자 정보 가져오기
  const { data: posts, isLoading, error } = useQuery({
      queryKey: ['posts'],
      queryFn: async () => {
        return [];
      },
  });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="main-container">
          <div className="dashboard-header">
            <div className="header-left">
              <h2>Dashboard</h2>
              {user && <div className="welcome-msg">Welcome, {user.name}!</div>}
            </div>
            <div className="header-right">
              <Link to="/dashboard/new">
                <Button variant="primary" className="write-button">글작성</Button>
              </Link>
            </div>
          </div>
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.id} className="post-item">
                <Link to={`/dashboard/posts/${post.id}`} className="post-link">
                  <h3>{post.title}</h3>
                  <p>{post.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    

export default Dashboard;