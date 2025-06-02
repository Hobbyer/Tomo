import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useWebSocket(url, onMessageReceived) {
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null); // Reference to the STOMP client

  useEffect(() => {
    // 1) SockJS 팩토리로 서버에 연결
    const socket = new SockJS(url);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // 재연결 시도 간격 (5초)
      onConnect: () => {
        console.log("STOMP connected!");
        setConnected(true);

        // 2) "/topic.edits" 구독
        stompClient.subscribe("/topic/edits", (message) => {
          const body = JSON.parse(message.body);
          onMessageReceived(body);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
    });

    stompClient.activate(); // STOMP 클라이언트 활성화
    stompClientRef.current = stompClient; // STOMP 클라이언트 참조 저장

    return () => {
      stompClient.deactivate(); // 컴포넌트 언마운트 시 STOMP 클라이언트 비활성화
      setConnected(false);
    };
  }, [url]);

  // 3) 메시지 전송 함수
  const sendMessage = (destination, payload) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination,
        body: JSON.stringify(payload),
      });
    } else {
      console.warn("STOMP not connected yet!");
    }
  };

  return { connected, sendMessage };
}