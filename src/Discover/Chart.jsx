import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/common.css';
import './Chart.css';

function Chart() {
  const [priceHistory, setPriceHistory] = useState([]);
  const [parts, setParts] = useState([]);
  const [priceTrends, setPriceTrends] = useState([]);
  const [componentDistribution, setComponentDistribution] = useState([]);
  return (
    <div className="main-container">
      <h1>Chart</h1>
      
      {/* 페이지네이션 */}
      <div className="pagination">
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
      </div>
      
      {/* 가격 카드 섹션 */}
      <div className="price-cards">
        <div className="price-card">
          <h3>Total Price</h3>
          <h2>1,099,830 KRW</h2>
          <p>May vary from day to day</p>
        </div>
        
        <div className="price-card">
          <h3>Graphics Card</h3>
          <h2>454,680 KRW</h2>
          <p>GeForce 4060</p>
        </div>
        
        <div className="price-card">
          <h3>CPU</h3>
          <h2>239,140 KRW</h2>
          <p>AMD RYZEN5 - 5th 7500F</p>
        </div>
      </div>
      
      {/* 차트 및 부품 목록 섹션 */}
      <div className="charts-container">
        <div className="chart-box">
          <h3>Total price trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis domain={[900000, 1200000]} />
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
      
      {/* 가격 추이 및 분포 차트 섹션 */}
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
                  <td>{trend.launchPrice.toLocaleString()}</td>
                  <td className={
                    trend.change.includes('+') 
                      ? 'positive-change' 
                      : trend.change.includes('-') 
                        ? 'negative-change' 
                        : 'neutral-change'
                  }>
                    {trend.change}
                  </td>
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
    </div>
  );
}

export default Chart;
