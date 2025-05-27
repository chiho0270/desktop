import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import '../styles/common.css';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:8000/post/${id}`);
        if (!res.ok) throw new Error('게시물을 불러오지 못했습니다.');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>글을 찾을 수 없습니다.</div>;

  return (
    <div className="main-container post-detail-container">
      <Button className="back-button" variant="secondary" onClick={() => navigate(-1)}>
        뒤로가기
      </Button>
      <h2>{post.title}</h2>
      {post.photo_url && <img src={`http://localhost:8000${post.photo_url}`} alt={post.title} className="post-image" />}
      <div className="post-meta">by {post.user_name} | {new Date(post.created_at).toLocaleString()}</div>
      <p>{post.content}</p>
    </div>
  );
}

export default PostDetail;
