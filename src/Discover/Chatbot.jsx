import React, { useEffect } from 'react';
import '../styles/common.css';

function ChatBot() {
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'CHAT_HISTORY') {
          const chatData = data.data.map(([user, bot]) => ({
            user,
            bot,
            timestamp: new Date().toISOString()
          }));
          localStorage.setItem('chatHistory', JSON.stringify(chatData));
        }
      } catch (e) {
        console.error('메시지 파싱 오류:', e);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="main-container" style={{ minWidth: 0, padding: 0 }}>
      <iframe
        title="Gradio Chatbot"
        src="http://127.0.0.1:7860" // Gradio Chatbot URL
        width="100%"
        height="730px"
        style={{
          border: 'none',
          width: '100%',
          height: '730px',       // ★ style에도 height: 730px
          minHeight: '730px'
        }}
        allow="clipboard-write"
      />
    </div>
  );
}

export default ChatBot;