import React, { useState, useEffect } from 'react';
import '../styles/common.css';
import './Comparison.css';

function Comparison() {
  const [activeTab, setActiveTab] = useState('cpu');
  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);
  const [partsDatabase, setPartsDatabase] = useState([]);
  const [loading, setLoading] = useState(false);

  const tabSpecs = {
    cpu: ['제조사', '코어 갯수', '스레드 갯수', '베이스 클럭', '부스트 클럭', '소비전력', '내장그래픽', '공정 크기'],
    vga: ['모델이름', '제조사', '메모리 용량', '메모리 타입', '베이스 클럭', 'CUDA코어 갯수', '소비전력', '색상'],
    ram: ['제조사', '클럭', '메모리 타입', '메모리 용량', '색상']
  };

  const currentSpecs = tabSpecs[activeTab] || [];

  // 부품 리스트 불러오기
  useEffect(() => {
    setLoading(true);
    let category = '';
    if (activeTab === 'cpu') category = 'cpu';
    else if (activeTab === 'vga') category = 'vga';
    else if (activeTab === 'ram') category = 'ram';
    fetch(`http://localhost:8000/parts/list?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setPartsDatabase(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeTab]);

  const fetchDetail = async (category, product_id, setProduct) => {
    if (!product_id) return setProduct(null);
    let backendCategory = '';
    if (category === 'cpu') backendCategory = 'cpu';
    else if (category === 'vga') backendCategory = 'vga';
    else if (category === 'ram') backendCategory = 'ram';
    const res = await fetch(`http://localhost:8000/parts/detail?category=${backendCategory}&product_id=${product_id}`);
    if (res.ok) {
      const detail = await res.json();
      let specs = {};
      if (category === 'cpu') {
        specs = {
          '제조사': detail.manufacturer,
          '코어 갯수': detail.core_count,
          '스레드 갯수': detail.thread_count,
          '베이스 클럭': detail.base_clock,
          '부스트 클럭': detail.bost_clock,
          '소비전력': detail.tdp,
          '내장그래픽': detail.integrated_graphics,
          '공정 크기': detail.process_size,
          '소켓 타입': detail.socket_type,
          '모델이름': detail.model_name // 추가: name이 undefined일 때 대비
        };
      } else if (category === 'vga') {
        specs = {
          '모델이름': detail.model_name,
          '제조사': detail.manufacturer,
          '메모리 용량': detail.memory_size,
          '메모리 타입': detail.memory_type,
          '베이스 클럭': detail.base_clock_speed,
          'CUDA코어 갯수': detail.cuda_cores,
          '소비전력': detail.tdp,
          '색상': detail.color
        };
      } else if (category === 'ram') {
        specs = {
          '제조사': detail.manufacturer,
          '클럭': detail.clock,
          '메모리 타입': detail.memory_type,
          '메모리 용량': detail.memory_size,
          '색상': detail.color
        };
      }
      setProduct({ id: detail.product_id, name: detail.model_name || detail.name, specs });
    } else {
      setProduct(null);
    }
  };

  const handleSelect1 = (e) => {
    const selectedId = Number(e.target.value);
    fetchDetail(activeTab, selectedId, setProduct1);
  };
  const handleSelect2 = (e) => {
    const selectedId = Number(e.target.value);
    fetchDetail(activeTab, selectedId, setProduct2);
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
          className={`tab-button ${activeTab === 'vga' ? 'active' : ''}`}
          onClick={() => handleTabChange('vga')}
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
            {partsDatabase.map(part => (
              <option key={part.product_id} value={part.product_id}>
                ({part.manufacturer || '-'}) {part.model_name} 
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
            {partsDatabase.map(part => (
              <option key={part.product_id} value={part.product_id}>
                ({part.manufacturer || '-'}) {part.model_name} 
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="select-message">불러오는 중...</p>
      ) : product1 && product2 ? (
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
