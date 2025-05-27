import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import '../styles/common.css';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 실제 API 호출 예시 (주석 해제 시 사용)
    // fetch(`/api/posts/${id}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setPost(data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     setError(err.message);
    //     setLoading(false);
    //   });

    // 임시 예시 데이터 (API 없이도 결과 확인 가능)
    const examplePost = {
      id: id,
      title: "예시 글 제목",
      summary: "예시 요약",
      content: "이것은 예시 글 내용입니다. 상세 내용을 여기에 표시합니다.",
      image: "https://example.com/example-image.jpg"
    };
    setPost(examplePost);
    setLoading(false);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>글을 찾을 수 없습니다.</div>;

  return (
    <div className="main-container post-detail-container">
      <Button className="back-button" variant="secondary" onClick={() => navigate(-1)}>
        뒤로가기
      </Button>
      <h2>{post.title}</h2>
      {post.image && <img src={post.image} alt={post.title} className="post-image" />}
      <p>{post.content}</p>
    </div>
  );
}

export default PostDetail;
