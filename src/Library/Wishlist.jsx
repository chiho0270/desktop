import React from 'react';
import '../styles/common.css';
import './Wishlist.css';

function Wishlist() {
  // 부품 데이터 예시 (실제 데이터로 교체)
  const partsData = [];

  return (
    <div className="main-container">
      <div className="wishlist-header">
        <h2>Wish 부품</h2>
      </div>
      <div className="wishlist-content">
        <div className="section-grid">
          {partsData.map((section) => (
            <div key={section.category} className="part-section">
              <h3>{section.category}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item} className="part-item">{item}</li>
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
