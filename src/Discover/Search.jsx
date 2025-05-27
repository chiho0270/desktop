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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // 위시리스트 추가 상태
  const [wishMsg, setWishMsg] = useState("");

  // DB에서 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/search/parts?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('검색 실패');
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
      setSearchResults([]);
    } finally {
      setHasSearched(true);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  // Wish 버튼 클릭 핸들러
  const handleWish = async (part) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setWishMsg("로그인이 필요합니다.");
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/wishlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, product_id: part.id })
      });
      const data = await response.json();
      if (!response.ok) {
        setWishMsg(data.detail || '추가 실패');
      } else {
        setWishMsg('위시리스트에 추가되었습니다!');
      }
    } catch (err) {
      setWishMsg('네트워크 오류');
    }
    setTimeout(() => setWishMsg(""), 2000);
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
                  setError(null);
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
        {loading && <div className="search-loading">검색 중...</div>}
        {error && <div className="search-error">{error}</div>}
        {hasSearched && !loading && !error && (
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
                    <p className="part-specs">{part.manufacturer ? `제조사: ${part.manufacturer}` : ''}</p>
                    <p className="part-price">{part.price ? `가격: ${part.price}원` : ''}</p>
                  </div>
                  <div className="part-actions">
                    <Button variant="outline-success" size="sm" onClick={() => handleWish(part)}>Wish</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {/* Wish 결과 메시지 */}
        {wishMsg && <div className="wish-msg">{wishMsg}</div>}
      </div>
    </div>
  );
}

export default Search;
