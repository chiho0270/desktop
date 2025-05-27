import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../styles/common.css';
import './Search.css';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // 샘플 데이터베이스 (실제 데이터로 교체 필요)
  const partsDatabase = [
  {
    id: 1,
    type: 'CPU',
    name: 'AMD Ryzen 5 5600X',
    specs: '6코어/12스레드, 기본 3.7GHz, 최대 4.6GHz, 65W',
    price: '329,000원'
  },
  {
    id: 2,
    type: 'CPU',
    name: 'NVIDIA GeForce RTX 3060 Ti',
    specs: '8GB GDDR6, 1665MHz, 4864 CUDA 코어',
    price: '679,000원'
  },
  {
    id: 3,
    type: 'CPU',
    name: '삼성 DDR4-3200 16GB',
    specs: 'DDR4, 3200MHz, CL22, 1.2V',
    price: '76,500원'
  },
  {
    id: 4,
    type: 'CPU',
    name: '삼성 980 PRO 1TB',
    specs: 'PCIe 4.0 NVMe, 순차읽기 7,000MB/s, 순차쓰기 5,000MB/s',
    price: '189,000원'
  },
  {
    id: 5,
    type: 'CPU',
    name: '마이크로닉스 Classic II 600W',
    specs: '80 PLUS 230V EU 표준, 140mm 팬',
    price: '61,020원'
  }
];

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = partsDatabase.filter(part => 
      part.name.toLowerCase().includes(query) || 
      part.type.toLowerCase().includes(query)
    );
    setSearchResults(filtered);
    setHasSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="main-container">
      <div className="search-container">
        <div className="search-box">
          <Form className="search-form">
            <Form.Control
              type="search"
              placeholder="부품명 또는 모델명을 입력하세요"
              className="search-input"
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                if (value === '') {
                  setSearchResults([]);
                  setHasSearched(false);
                }
              }}
              onKeyPress={handleKeyPress}
            />
            <Button
              variant="outline-primary" 
              className="search-button"
              onClick={handleSearch}
              style={{ marginLeft: 4 }}
            >
              <FaSearch />
            </Button>
          </Form>
        </div>

        {/* 검색 결과는 hasSearched가 true일 때만 표시 */}
        {hasSearched && (
          <div className="search-results">
            {searchResults.length === 0 ? (
              <div className="no-results">
                <p>검색 결과가 없습니다</p>
              </div>
            ) : (
              searchResults.map(part => (
                <div key={part.id} className="part-card">
                  <div className="part-info">
                    <span className="part-type">{part.type}</span>
                    <h3 className="part-name">{part.name}</h3>
                    <p className="part-specs">{part.specs}</p>
                    <p className="part-price">{part.price}</p>
                  </div>
                  <div className="part-actions">
                    <Button variant="outline-success" size="sm">Wish</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
