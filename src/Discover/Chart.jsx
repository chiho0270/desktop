import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/common.css';
import './Chart.css';

function Chart() {
  const [estimates, setEstimates] = useState([]);
  // 각 차트(1,2,3)에 연결된 견적 인덱스
  const [selectedIdx, setSelectedIdx] = useState([null, null, null]);
  // 현재 보고 있는 차트 번호
  const [activeChart, setActiveChart] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('estimateHistory');
    if (saved) setEstimates(JSON.parse(saved));
  }, []);

  // 현재 차트에 연결된 견적
  const estimate = selectedIdx[activeChart] !== null ? estimates[selectedIdx[activeChart]] : null;

  // 드롭다운에서 견적 선택 시, 현재 차트 번호에만 연결
  const handleEstimateChange = (e) => {
    const newIdx = [...selectedIdx];
    newIdx[activeChart] = e.target.value === "" ? null : Number(e.target.value);
    setSelectedIdx(newIdx);
  };

  // 부품/가격 데이터 변환
  const parts = (estimate?.parts || []).map(part => ({
    letter: part.type[0],
    type: part.type,
    name: part.name
  }));

  const componentDistribution = (estimate?.parts || []).map(part => ({
    name: part.type,
    value: part.price
  }));

  const priceTrends = (estimate?.parts || []).map(part => ({
    name: part.name,
    launchPrice: part.price,
    change: '0%'
  }));

  // GPU/CPU 정보
  const gpu = componentDistribution.find(item => item.name === 'GPU');
  const gpuPart = parts.find(part => part.type === 'GPU');
  const cpu = componentDistribution.find(item => item.name === 'CPU');
  const cpuPart = parts.find(part => part.type === 'CPU');
  const totalPrice = estimate?.total;

  // 예시 가격 히스토리
  const priceHistory = [
    { date: '6일 전', price: totalPrice },
    { date: '3일 전 ', price: totalPrice },
    { date: '오늘', price: totalPrice }
  ];

  return (
    <div className="main-container">
      <h1>Chart</h1>
      {/* 페이지네이션 */}
      <div className="pagination">
        {[0, 1, 2].map(i => (
          <button
            key={i}
            className={activeChart === i ? "active" : ""}
            onClick={() => setActiveChart(i)}
          >{i + 1}</button>
        ))}
      </div>
      {/* 견적 선택 드롭다운 (하나만!) */}
      <div className="chart-selectors" style={{ marginBottom: 24 }}>
        <select
          value={selectedIdx[activeChart] ?? ""}
          onChange={handleEstimateChange}
        >
          <option value="">견적 선택</option>
          {estimates.map((est, idx) => (
            <option key={idx} value={idx}>
              {/* 용도 + (총가격) */}
              {est.conditions?.find(cond => cond.startsWith('용도')) 
                ? est.conditions.find(cond => cond.startsWith('용도')) 
                : `견적 ${idx + 1}`
              }
              {est.total ? ` (${est.total.toLocaleString()}원)` : ''}
            </option>
          ))}
        </select>
      </div>
      {/* 견적이 선택되지 않았을 때 안내 */}
      {!estimate && (
        <div style={{ marginTop: 40, color: '#888' }}>선택된 견적이 없습니다.</div>
      )}
      {/* 견적이 선택된 경우만 차트/카드/표 표시 */}
      {estimate && (
        <>
          {/* 가격 카드 */}
          <div className="price-cards">
            <div className="price-card">
              <h3>Total Price</h3>
              <h2>{totalPrice ? totalPrice.toLocaleString() + " KRW" : "-"}</h2>
              <p>May vary from day to day</p>
            </div>
            <div className="price-card">
              <h3>Graphics Card</h3>
              <h2>{gpu ? gpu.value.toLocaleString() + " KRW" : "-"}</h2>
              <p>{gpuPart ? gpuPart.name : "-"}</p>
            </div>
            <div className="price-card">
              <h3>CPU</h3>
              <h2>{cpu ? cpu.value.toLocaleString() + " KRW" : "-"}</h2>
              <p>{cpuPart ? cpuPart.name : "-"}</p>
            </div>
          </div>
          {/* 차트 및 부품 목록 */}
          <div className="charts-container">
            <div className="chart-box">
              <h3>Total price trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#333" 
                    strokeWidth={2}
                    dot={{ r: 4 }} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="parts-list">
              <h3>Part</h3>
              {parts.map((part, index) => (
                <div key={index} className="part-item">
                  <div className="part-letter">{part.letter}</div>
                  <div className="part-details">
                    <div className="part-type">{part.type}</div>
                    <div className="part-name">{part.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* 가격 추이 및 분포 차트 */}
          <div className="charts-container">
            <div className="chart-box">
              <h3>Price trend</h3>
              <table className="price-trend-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Launch price</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {priceTrends.map((trend, index) => (
                    <tr key={index}>
                      <td>{trend.name}</td>
                      <td>{trend.launchPrice?.toLocaleString()}</td>
                      <td className="neutral-change">{trend.change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="chart-box">
              <h3>Part</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart 
                  data={componentDistribution}
                  layout="vertical"
                  barSize={30}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#333" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Chart;
