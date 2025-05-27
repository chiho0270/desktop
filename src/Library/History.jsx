import React, { useEffect, useState } from 'react';
import '../styles/common.css';
import './History.css';

function History() {
  const [estimates, setEstimates] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('estimateHistory');
    if (saved) setEstimates(JSON.parse(saved));
  }, []);

  const handleClear = () => {
    localStorage.removeItem('estimateHistory');
    setEstimates([]);
  };

  return (
    <div className="main-container">
      <div className="history-header">
        <h2>생성된 견적 목록</h2>
        {estimates.length > 0 && (
          <button className="clear-btn" onClick={handleClear}>전체 삭제</button>
        )}
      </div>
      
      <div className="estimate-list">
        {estimates.length === 0 ? (
          <div className="no-history">생성된 견적이 없습니다</div>
        ) : (
          estimates.map((estimate, idx) => (
            <div key={idx} className="estimate-card">
              <div className="estimate-header">
                <span className="timestamp">{new Date(estimate.timestamp).toLocaleString()}</span>
                <span className="total-price">총 견적: {estimate.total.toLocaleString()}원</span>
              </div>
              
              <div className="user-conditions">
                <h4>요청사항</h4>
                <ul>
                  {estimate.conditions.map((condition, i) => (
                    <li key={i}>✔️ {condition}</li>
                  ))}
                </ul>
              </div>

              <div className="parts-list">
                <h4>추천 부품 목록</h4>
                <table>
                  <thead>
                    <tr>
                      <th>부품</th>
                      <th>모델명</th>
                      <th>가격</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimate.parts.map((part, i) => (
                      <tr key={i}>
                        <td>{part.type}</td>
                        <td>{part.name}</td>
                        <td>{part.price.toLocaleString()}원</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;
