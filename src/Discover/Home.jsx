import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../styles/common.css';
import './Home.css';

function Home() {
  // 부품 실시간 가격 데이터 가져오기
  const { data: partPrices = [], isLoading: priceLoading, error: priceError } = useQuery({
    queryKey: ['partPrices'],
    queryFn: async () => {
      const response = await fetch('/api/parts-price'); // 셀러리/크롤러가 제공하는 API
      return response.json();
    },
  });

  const { data: cards, isLoading, error } = useQuery({
    queryKey: ['cards'], // query key
    queryFn: async () => {
      return [];
    },
  });

  // 최근 게시물 가져오기
  const [recentPosts, setRecentPosts] = React.useState([]);
  const [postLoading, setPostLoading] = React.useState(true);
  const [postError, setPostError] = React.useState(null);

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:8000/posts');
        if (!res.ok) throw new Error('게시물 목록을 불러오지 못했습니다.');
        const data = await res.json();
        setRecentPosts(data.slice(0, 4));
      } catch (err) {
        setPostError(err.message);
      } finally {
        setPostLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="main-container">
      <h2>
        <Link to="/dashboard">Dashboard</Link>
      </h2>
      <p>Notice Board...</p>
      {postLoading ? (
        <div>Loading...</div>
      ) : postError ? (
        <div>Error: {postError}</div>
      ) : (
        <div className="recent-posts-row">
          {recentPosts.map((post) => (
            <Link to={`/dashboard/posts/${post.post_id}`} key={post.post_id} className="recent-post-card">
              {post.photo_url && <img src={`http://localhost:8000${post.photo_url}`} alt="썸네일" className="recent-post-img" />}
              <div className="recent-post-title">{post.title}</div>
              <div className="recent-post-summary">{post.summary}</div>
              <div className="recent-post-meta">by {post.user_name} | {new Date(post.created_at).toLocaleString()}</div>
            </Link>
          ))}
        </div>
      )}

      <div className="dashboard-content">
        {cards.map((card, index) => (
          <Card key={index} className="card">
            <Card.Img variant="top" src={card.image} />
            <Card.Body>
              <Card.Title>{card.title}</Card.Title>
              <Card.Text>{card.text}</Card.Text>
            </Card.Body>
          </Card>
        ))}
    </div>
      <h2>Real-time price</h2>
      <p>"Danawa" standard...</p>
      <div className="realtime-price-row">
        {partPrices.map((part, idx) => (
          <div className="realtime-price-item" key={idx}>
            <img src={part.image} alt={part.name} className="realtime-price-img" />
            <div className="realtime-price-name">{part.name}</div>
            <div className="realtime-price-value">{Number(part.price).toLocaleString()} KRW</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;