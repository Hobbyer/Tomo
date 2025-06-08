package com._lumey.tomo.edit.service;

import com._lumey.tomo.edit.entity.DocumentEntity;

import java.util.Optional;

public interface DocumentService {

  // 문서 로드
  Optional<DocumentEntity> loadDocument(String docId);

  // 새 문서 생성
  DocumentEntity createDocument(String docId, byte[] initialUpdate);

  // 기존 문서 덮어쓰기
  DocumentEntity saveDocument(String docId, byte[] mergedUpdate);
}
