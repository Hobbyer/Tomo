package com._lumey.tomo.edit.controller;

import lombok.Data;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

@Data
// 전형적인 STOMP 웹소켓 컨트롤러는 @Controller + @MessageMapping 어노테이션을 사용한다.
public class EditController {

  /*
  * 클라이언트가 "/app/edit" 으로 메시지를 보내면 이 메서드가 호출됨.
  * 예)
  *   stompClient.send("/app/edit", {}, JSON.stringify({ action: "join", user: "eunyeob }
  *
  * @SendTo("/topic/edits") -> 이 메서드가 반환(return) 하는 객체(JSON) 는 클라이언트가 구독(subscribe) 한 "/topic/edits" 으로 전송됨.
  */

  @MessageMapping("/edit")
  @SendTo("/topic/edits")
  public EditMessage handleEdit(EditMessage message) {
    // 실제로는 message 를 가공하거나, DB에 저장 후 결과 리턴 가능
    // 여기서는 받은 메시지를 그대로 다시 브로드캐스트(broadcast) 하는 예시임.
    return message; // 받은 메시지를 그대로 반환
  }

  // ===============================================
  // 2) 메시지 바인딩용 DTO 클래스 (간단 예시)
  // ===============================================
  public static class EditMessage {
    private String acition; // 예: "join", "leave", "update"
    private String user; // 사용자 이름
    private String payload; // 실제 편집 내용 (예: JSON, 텍스트 등)

    public EditMessage() {}
    public EditMessage(String action, String user, String payload) {
      this.acition = action;
      this.user = user;
      this.payload = payload;
    }
  }
}
