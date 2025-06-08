package com._lumey.tomo.edit.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocRequestDTO {

  private String base64Update; // Base64로 인코딩된 Yjs 업데이트 데이터
  private boolean newDocument; // 새 문서인지 여부
}
