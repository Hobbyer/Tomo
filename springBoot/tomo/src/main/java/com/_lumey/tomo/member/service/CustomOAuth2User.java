package com._lumey.tomo.member.service;

import com._lumey.tomo.member.entity.MemberEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Data
@RequiredArgsConstructor

public class CustomOAuth2User implements OAuth2User {

  private final MemberEntity member;
  private final Map<String, Object> attributes;

  @Override
  public String getName() {
    return member.getName();
  }

  @Override
  public Map<String, Object> getAttributes() {
    return attributes;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of();
  }
}
