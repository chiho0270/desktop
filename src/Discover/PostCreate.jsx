import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import '../styles/common.css';
import './PostCreate.css';

function PostCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // 이미지 파일
  const [preview, setPreview] = useState(null); // 미리보기 URL
  const [error, setError] = useState('');

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    // 미리보기 URL 생성하지 않음!
  };

  // 내용 앞 60자 요약 생성
  const getSummary = (text) => {
    const summary = text.replace(/\n/g, ' ').slice(0, 60);
    return summary.length === 60 ? summary + "..." : summary;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }
    // 실제 서버 전송 로직 (FormData 활용)
    // const formData = new FormData();
    // formData.append('title', title);
    // formData.append('content', content);
    // formData.append('summary', getSummary(content));
    // if (image) formData.append('image', image);
    // await axios.post('/api/posts', formData);

    alert('글이 성공적으로 작성되었습니다!\n\n요약: ' + getSummary(content));
    navigate('/dashboard');
  };

  return (
    <div className="main-container post-create-container">
      <h2>글 작성</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="post-create-form">
        <label htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="post-input"
          maxLength={100}
          placeholder="제목을 입력하세요"
        />

        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="post-textarea"
          placeholder="내용을 입력하세요"
          rows={10}
        />

        <label htmlFor="image">사진 첨부</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="post-input"
        />

        <Button variant="primary" type="submit" className="submit-button">
          작성 완료
        </Button>
      </form>
    </div>
  );
}

export default PostCreate;
