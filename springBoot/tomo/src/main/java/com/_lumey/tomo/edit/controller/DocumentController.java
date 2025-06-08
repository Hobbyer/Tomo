package com._lumey.tomo.edit.controller;

import com._lumey.tomo.edit.dto.DocRequestDTO;
import com._lumey.tomo.edit.dto.DocResponseDTO;
import com._lumey.tomo.edit.entity.DocumentEntity;
import com._lumey.tomo.edit.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
@RequestMapping("/documents")
public class DocumentController {

  private final DocumentService documentService;

  // 1) GET => 문서 로드
  @GetMapping("/{docId}")
  public ResponseEntity<DocResponseDTO> getDocument(@PathVariable("docId") String docId) {
    Optional<DocumentEntity> opt = documentService.loadDocument(docId);
    if (opt.isEmpty()) {
      // 문서가 존재하지 않는 경우
      return ResponseEntity.ok(new DocResponseDTO("", 0));
    } else {

    }
    DocumentEntity doc = opt.get();
    // 저장된 byte[] => Base64 인코딩
    String base64 = Base64.getEncoder().encodeToString(doc.getYjsUpdate());
    return ResponseEntity.ok(new DocResponseDTO(base64, doc.getYjsUpdate().length));
    }

  // 2) POST => 새 문서 생성
  @PostMapping("/{docId}")
  public ResponseEntity<String> saveDocument(@PathVariable("docId") String docId, @RequestBody DocRequestDTO requestDTO){
    try {
      // Base64 문자열 => byte[] 디코딩
      byte[] updateBytes = Base64.getDecoder().decode(requestDTO.getBase64Update());

      if (requestDTO.isNewDocument()){
        // 새 문서인 경우
        documentService.createDocument(docId, updateBytes);
      } else {
        // 기존 문서 덮어쓰기
        documentService.saveDocument(docId, updateBytes);
      }
      return ResponseEntity.ok("ok");
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("invalid update");
    }
  }
}
