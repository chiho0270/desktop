import React, { useState } from 'react';
import './styles/common.css';
import './User.css';

function User({ initialName = "", userId = "" }) {
  // 가상의 사용자 정보 (실제 서비스에서는 API로 받아옴)
  const [name, setName] = useState(initialName);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(name);
  
  // 비밀번호 변경 폼 상태
  const [showPwForm, setShowPwForm] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  // 이름 변경 핸들러
  const handleNameSave = () => {
    if (newName.trim() === "") return;
    setName(newName);
    setEditingName(false);
  };

  // 비밀번호 변경 핸들러 (실제 서비스에서는 서버와 연동)
  const handlePwChange = (e) => {
    e.preventDefault();
    if (!oldPw || !newPw || !newPw2) {
      setPwMsg("모든 항목을 입력해주세요.");
      return;
    }
    if (newPw !== newPw2) {
      setPwMsg("비밀번호가 일치하지 않습니다.");
      return;
    }
    setPwMsg("비밀번호가 성공적으로 변경되었습니다.");
    setOldPw("");
    setNewPw("");
    setNewPw2("");
    setShowPwForm(false);
  };

  return (
    <div className="main-container user-page">
      <h2>My page</h2>
      <div className="user-info-card">
        <div className="user-info-row">
          <span className="user-label">Name</span>
          {editingName ? (
            <>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="user-input"
                maxLength={20}
              />
              <button className="user-btn" onClick={handleNameSave}>Confirm</button>
              <button className="user-btn" onClick={() => setEditingName(false)}>Cancel</button>
            </>
          ) : (
            <>
              <span className="user-value">{name}</span>
              <button className="user-btn" onClick={() => { setEditingName(true); setNewName(name); }}>Edit</button>
            </>
          )}
        </div>
        <div className="user-info-row">
          <span className="user-label">ID</span>
          <span className="user-value">{userId}</span>
        </div>
        <div className="user-info-row">
          <span className="user-label">Password</span>
          <button className="user-btn" onClick={() => setShowPwForm(!showPwForm)}>
            {showPwForm ? "Close" : "Confirm"}
          </button>
        </div>
        {showPwForm && (
          <form className="pw-form" onSubmit={handlePwChange}>
            <input
              type="password"
              placeholder="현재 비밀번호"
              value={oldPw}
              onChange={e => setOldPw(e.target.value)}
              className="user-input"
            />
            <input
              type="password"
              placeholder="새 비밀번호"
              value={newPw}
              onChange={e => setNewPw(e.target.value)}
              className="user-input"
            />
            <input
              type="password"
              placeholder="새 비밀번호 확인"
              value={newPw2}
              onChange={e => setNewPw2(e.target.value)}
              className="user-input"
            />
            <button className="user-btn" type="submit">Change</button>
            {pwMsg && <div className="pw-msg">{pwMsg}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

export default User;
