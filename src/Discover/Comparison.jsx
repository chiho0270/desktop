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

  // 드롭다운에서 선택 시 id로 해당 part 객체를 찾아서 저장
  const handleSelect1 = (e) => {
    const selected = filteredDatabase.find(part => part.id === Number(e.target.value));
    setProduct1(selected || null);
  };
  const handleSelect2 = (e) => {
    const selected = filteredDatabase.find(part => part.id === Number(e.target.value));
    setProduct2(selected || null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setProduct1(null);
    setProduct2(null);
  };

  return (
    <div className="main-container">
      <div className="tab-toggle">
        <button
          className={`tab-button ${activeTab === 'cpu' ? 'active' : ''}`}
          onClick={() => handleTabChange('cpu')}
        >
          CPU
        </button>
        <button
          className={`tab-button ${activeTab === 'gpa' ? 'active' : ''}`}
          onClick={() => handleTabChange('gpa')}
        >
          GPU
        </button>
        <button
          className={`tab-button ${activeTab === 'ram' ? 'active' : ''}`}
          onClick={() => handleTabChange('ram')}
        >
          RAM
        </button>
      </div>

      <div className="product-selectors">
        <div className="dropdown-box">
          <select
            className="product-search-input"
            value={product1 ? product1.id : ''}
            onChange={handleSelect1}
          >
            <option value="">제품 1 선택</option>
            {filteredDatabase.map(part => (
              <option key={part.id} value={part.id}>
                {part.name} ({part.price})
              </option>
            ))}
          </select>
        </div>
        <div className="dropdown-box">
          <select
            className="product-search-input"
            value={product2 ? product2.id : ''}
            onChange={handleSelect2}
          >
            <option value="">제품 2 선택</option>
            {filteredDatabase.map(part => (
              <option key={part.id} value={part.id}>
                {part.name} ({part.price})
              </option>
            ))}
          </select>
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
