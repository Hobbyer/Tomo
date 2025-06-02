package com._lumey.tomo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // STOMP 메시징 활성화 어노테이션
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  /*
  * 1) STOMP 엔드포인트 등록
  *   - 클라이언트가 WebSocket 으로 접속할 때 사용할 URI를 선언.
  *   - 여기선 "/ws-edit" 라는 경로를 쓰도록 하겠음.
  *   - SockJS 를 함께 사용할 수도 있는데, 만약 순수 웹소켓만 쓰려면 .withSockJS() 를 제거하면 됨.
  */

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry
        .addEndpoint("/ws-edit")  // 클라이언트가 이 경로로 ws 연결 요청
        .setAllowedOriginPatterns("*")   // CORS 문제없이 모든 도메인 허용 (필요에 따라 조정 가능)
        .withSockJS();                   // SockJS fallback 옵션 (브라우저가 ws를 못 쓰는 경우 자동 폴백)
  }

  /*
  * 2) 메시지 라우팅(브로커) 설정
  *   - /topic 으로 시작하는 메시지(destination) 는 브로커(내장 메모리 브로커)로 보내고,
  *   - /app 으로 시작하는 메시지는 @MessageMapping 이 붙은 메서드로 라우팅됨.
  */

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    // 클라이언트에 메세지를 브로드캐스트할 때 사용할 prefix
    registry.enableSimpleBroker("/topic");
    // 클라이언트가 서버(컨트롤러)로 보낼 때 사용할 prefix
    registry.setApplicationDestinationPrefixes("/app");

  }
}
