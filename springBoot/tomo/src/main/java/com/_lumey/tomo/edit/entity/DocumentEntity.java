package com._lumey.tomo.edit.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentEntity {

  @Id
  @Column(name = "doc_id", length = 100)
  private String docId; // 문서 ID (Primary Key)

  @Lob // 대용량 데이터 저장을 위한 어노테이션
  @Column(name = "yjs_update", columnDefinition = "BLOB")
  private byte[] yjsUpdate; // Yjs 업데이트 데이터 (BLOB 타입으로 저장)
}
