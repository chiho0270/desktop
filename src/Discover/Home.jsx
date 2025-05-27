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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="main-container">
      <h2>
        <Link to="/dashboard">Dashboard</Link>
      </h2>
      <p>Notice Board...</p>
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