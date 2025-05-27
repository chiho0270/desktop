import React, { useState } from 'react';
import '../styles/common.css';
import './Comparison.css';

function Comparison() {
  const [activeTab, setActiveTab] = useState('cpu');
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [results1, setResults1] = useState([]);
  const [results2, setResults2] = useState([]);
  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);
  const [partsDatabase, setPartsDatabase] = useState([])

  const tabSpecs = {
    cpu: ['제조사', '코어 갯수', '스레드 갯수', '베이스 클럭', '부스트 클럭', '소비전력', '내장그래픽', '공정 크기'],
    gpa: ['모델이름', '제조사', '메모리 용량', '메모리 타입', '베이스 클럭', 'CUDA코어 갯수', '소비전력', '색상'],
    ram: ['제조사', '클럭', '메모리 타입', '메모리 용량', '색상']
  };

  const currentSpecs = tabSpecs[activeTab] || [];

  const filteredDatabase = partsDatabase.filter(part => {
    if (activeTab === 'cpu') return part.type === 'CPU';
    if (activeTab === 'gpa') return part.type === '그래픽카드';
    if (activeTab === 'ram') return part.type === 'RAM';
    return true;
  });

  const handleSearch1 = (query) => {
    setSearch1(query);
    setResults1(
      filteredDatabase.filter(part =>
        part.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleSearch2 = (query) => {
    setSearch2(query);
    setResults2(
      filteredDatabase.filter(part =>
        part.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <div className="main-container">
      <div className="tab-toggle">
        <button
          className={`tab-button ${activeTab === 'cpu' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('cpu');
            setProduct1(null);
            setProduct2(null);
          }}
        >
          CPU
        </button>
        <button
          className={`tab-button ${activeTab === 'gpa' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('gpa');
            setProduct1(null);
            setProduct2(null);
          }}
        >
          GPU
        </button>
        <button
          className={`tab-button ${activeTab === 'ram' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('ram');
            setProduct1(null);
            setProduct2(null);
          }}
        >
          RAM
        </button>
      </div>

      <div className="product-selectors">
        <div className="search-box">
          <input
            type="search"
            placeholder="제품 1 검색"
            className="search-input"
            value={product1 ? product1.name : search1}
            onChange={e => handleSearch1(e.target.value)}
            disabled={!!product1}
          />
          {!product1 && search1 && (
            <div className="search-results">
              {results1.map(part => (
                <div
                  key={part.id}
                  className="part-card"
                  onClick={() => setProduct1(part)}
                >
                  <div className="part-info">
                    <span className="part-type">{part.type}</span>
                    <h3 className="part-name">{part.name}</h3>
                    <p className="part-specs">{Object.entries(part.specs).map(([k,v]) => `${k}: ${v}`).join(', ')}</p>
                    <p className="part-price">{part.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="search-box">
          <input
            type="search"
            placeholder="제품 2 검색"
            className="search-input"
            value={product2 ? product2.name : search2}
            onChange={e => handleSearch2(e.target.value)}
            disabled={!!product2}
          />
          {!product2 && search2 && (
            <div className="search-results">
              {results2.map(part => (
                <div
                  key={part.id}
                  className="part-card"
                  onClick={() => setProduct2(part)}
                >
                  <div className="part-info">
                    <span className="part-type">{part.type}</span>
                    <h3 className="part-name">{part.name}</h3>
                    <p className="part-specs">{Object.entries(part.specs).map(([k,v]) => `${k}: ${v}`).join(', ')}</p>
                    <p className="part-price">{part.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {product1 && product2 ? (
        <table className="spec-table">
          <thead>
            <tr>
              <th>스펙</th>
              <th>{product1.name}</th>
              <th>{product2.name}</th>
            </tr>
          </thead>
          <tbody>
            {currentSpecs.map(spec => (
              <tr key={spec}>
                <td className="spec-name">{spec}</td>
                <td>{product1.specs[spec] || '-'}</td>
                <td>{product2.specs[spec] || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="select-message">비교할 두 제품을 선택해주세요</p>
      )}
    </div>
  );
}

export default Comparison;
