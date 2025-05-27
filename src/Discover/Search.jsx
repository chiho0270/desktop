import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const partsDatabase = []

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
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              variant="outline-primary" 
              className="search-button"
              onClick={handleSearch}
            >
              <FaSearch />
            </Button>
          </Form>
        </div>

        <div className="search-results">
          {hasSearched && searchResults.length === 0 ? (
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
      </div>
    </div>
  );
}

export default Search;
