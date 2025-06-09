package com._lumey.tomo.edit.repository;

import com._lumey.tomo.edit.entity.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<DocumentEntity, String> {

}
