import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';
import '../styles/common.css';
import './Dashboard.css';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:8000/posts');
        if (!res.ok) throw new Error('게시물 목록을 불러오지 못했습니다.');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
          <li key={post.post_id} className="post-item">
            <Link to={`/dashboard/posts/${post.post_id}`} className="post-link">
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              {post.photo_url && <img src={`http://localhost:8000${post.photo_url}`} alt="썸네일" style={{maxWidth:'120px',maxHeight:'80px'}} />}
              <div className="post-meta">by {post.user_name} | {new Date(post.created_at).toLocaleString()}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;