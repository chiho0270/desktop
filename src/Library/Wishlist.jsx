import React, { useEffect, useState } from 'react';
import '../styles/common.css';
import './Wishlist.css';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }
    fetch(`http://localhost:8000/wishlist/${encodeURIComponent(user.email)}`)
      .then(res => {
        if (!res.ok) throw new Error('위시리스트를 불러올 수 없습니다.');
        return res.json();
      })
      .then(data => {
        setWishlist(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 파트 타입별로 그룹화
  const grouped = wishlist.reduce((acc, item) => {
    const type = item.part_type || '기타';
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  if (loading) return <div className="main-container">Loading...</div>;
  if (error) return <div className="main-container">{error}</div>;

  return (
    <div className="main-container">
      <div className="wishlist-header">
        <h2>Wish 부품</h2>
      </div>
      <div className="wishlist-content">
        <div className="section-grid">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="part-section">
              <h3>{category}</h3>
              <ul>
                {items.map(item => (
                  <li key={item.product_id} className="part-item">
                    <br></br>
                    {`제품명: ${item.model_name}`}
                    <br></br>
                    {`${item.manufacturer ? `제조사: ${item.manufacturer}` : ''}`}
                    <br></br>
                    {`${item.price ? `가격: ${item.price}원` : ''}`}
                    <br></br>
                    {/*<button style={{ backgroundColor: "#228be6", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={() => window.open(`https://prod.danawa.com/info/?pcode=${item.product_id}`, '_blank')}>상품 페이지</button>*/}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
