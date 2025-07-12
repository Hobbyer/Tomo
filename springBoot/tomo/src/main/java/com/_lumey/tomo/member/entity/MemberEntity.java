package com._lumey.tomo.member.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // 로그인 플랫폼
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AuthProviderEnum provider;

  // 해당 플랫폼의 고유 ID
  @Column(nullable = false, unique = true)
  private String providerId;


  @Column
  private String name;

  @Column
  private String email;

  @Column
  private String phoneNumber;

}
