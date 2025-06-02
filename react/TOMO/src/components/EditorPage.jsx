import React, { useState } from 'react'
import { useWebSocket } from '../hooks/useWebsocket';

const EditorPage = () => {
  const [messages, setMessages] = useState([]);

  // 1) useWebSocket "/ws-edit" 엔드포인트와 메시지 핸들러 전달
  const { connected, sendMessage } = useWebSocket(
    "http://localhost:8080/ws-edit",
    (message) => {
      // 서버에서 브로드캐스트된 메시지를 화면에 추가
      setMessages((prev) => [...prev, message]);
    }
  );

  // 2) 버튼 클릭시 "/app/edit" 으로 간단한 메시지 전송 예시
  const handleSend = () => {
    const payload = {
      action: "edit",
      user: "yeob",
      payload: "새로운 편집 내용 예시",
    };
    sendMessage("/app/edit", payload);
  };
  return (
    <>
      <div style={{ padding: "1rem" }}>
        <h2>WebSocket 실습: STOMP + SockJS</h2>
        <p>
          연결 상태: {" "}
          {connected ? (
            <span style={{ color: "green" }}>연결됨</span>
          ) : (
            <span style={{ color: "red" }}>연결되지 않음</span> 
          )}
        </p>
        <button type='button' onClick={handleSend} disabled={!connected}>
          서버로 메시지 보내기
        </button>

        <hr />

        <h3>받은 메시지 목록:</h3>
        <ul>
          {messages.map((msg, idx) => (
            <li key={idx}>
              <strong>{msg.user}</strong>: {msg.payload}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default EditorPage