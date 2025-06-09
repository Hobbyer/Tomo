package com._lumey.tomo.edit.service;

import com._lumey.tomo.edit.entity.DocumentEntity;
import com._lumey.tomo.edit.repository.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class DocumentServiceImpl implements DocumentService {

  private final DocumentRepository repository;

  public DocumentServiceImpl(DocumentRepository repository) {
    this.repository = repository;
  }

  // 문서 로드
  @Override
  public Optional<DocumentEntity> loadDocument(String docId) {
    return repository.findById(docId);
  }

  // 새 문서 생성
  @Override
  public DocumentEntity createDocument(String docId, byte[] initialUpdate) {
    DocumentEntity doc = new DocumentEntity(docId, initialUpdate);
    return repository.save(doc);
  }

  // 기존 문서 덮어쓰기
  @Override
  public DocumentEntity saveDocument(String docId, byte[] mergedUpdate) {
    DocumentEntity doc = new DocumentEntity(docId, mergedUpdate);
    return repository.save(doc);
  }
}
