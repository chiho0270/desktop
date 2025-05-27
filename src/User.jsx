import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import './styles/common.css';
import './User.css';

function User() {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(name);
  const [showPwForm, setShowPwForm] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [nameMsg, setNameMsg] = useState("");

  // 이름 변경 핸들러 (DB 반영)
  const handleNameSave = async () => {
    if (newName.trim() === "") return;
    try {
      const response = await fetch('http://localhost:8000/user/update_name', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name: newName })
      });
      if (!response.ok) {
        const data = await response.json();
        setNameMsg(data.detail || '이름 변경 실패');
        return;
      }
      setName(newName);
      setEditingName(false);
      setNameMsg('이름이 성공적으로 변경되었습니다.');
      // context와 localStorage의 user 정보도 갱신
      login({ ...user, name: newName });
    } catch (err) {
      setNameMsg('네트워크 오류');
    }
  };

  // 비밀번호 변경 핸들러 (DB 반영)
  const handlePwChange = async (e) => {
    e.preventDefault();
    setPwMsg("");
    if (!oldPw || !newPw || !newPw2) {
      setPwMsg("모든 항목을 입력해주세요.");
      return;
    }
    if (newPw !== newPw2) {
      setPwMsg("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/user/update_password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, old_password: oldPw, new_password: newPw })
      });
      if (!response.ok) {
        const data = await response.json();
        setPwMsg(data.detail || '비밀번호 변경 실패');
        return;
      }
      setPwMsg('비밀번호가 성공적으로 변경되었습니다.');
      setOldPw("");
      setNewPw("");
      setNewPw2("");
      setShowPwForm(false);
    } catch (err) {
      setPwMsg('네트워크 오류');
    }
  };

  if (!user) {
    return <div className="main-container user-page"><h2>로그인이 필요합니다.</h2></div>;
  }

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
              {nameMsg && <div className="pw-msg">{nameMsg}</div>}
            </>
          ) : (
            <>
              <span className="user-value">{name}</span>
              <button className="user-btn" onClick={() => { setEditingName(true); setNewName(name); setNameMsg(""); }}>Edit</button>
            </>
          )}
        </div>
        <div className="user-info-row">
          <span className="user-label">Email</span>
          <span className="user-value">{user.email}</span>
        </div>
        <div className="user-info-row">
          <span className="user-label">Password</span>
          <button className="user-btn" onClick={() => setShowPwForm(!showPwForm)}>
            {showPwForm ? "Close" : "Change"}
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
