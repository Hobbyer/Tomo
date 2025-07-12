package com._lumey.tomo.member.repository;

import com._lumey.tomo.member.entity.AuthProviderEnum;
import com._lumey.tomo.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, Long> {
  Optional<MemberEntity> findByProviderAndProviderId(AuthProviderEnum provider, String providerId);
}
