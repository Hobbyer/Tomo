package com._lumey.tomo.jwt;

import com._lumey.tomo.member.entity.AuthProviderEnum;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

  @Value("${jwt.secret}")
  private String secretKeyRaw;

  @Value("${jwt.expiration.access}")
  private long accessTokenValidityInMs;

  @Value("${jwt.expiration.refresh}")
  private long refreshTokenValidityInMs;

  private Key secretKey;

  @PostConstruct
  protected void init() {
    this.secretKey = Keys.hmacShaKeyFor(secretKeyRaw.getBytes());
  }

  // Access Token 생성
  public String createAccessToken(String providerId, AuthProviderEnum provider) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + accessTokenValidityInMs);

    return Jwts.builder()
        .setSubject(providerId)
        .claim("provider", provider.name())
        .setIssuedAt(now)
        .setExpiration(expiry)
        .signWith(secretKey, SignatureAlgorithm.HS256)
        .compact();
  }

  // Refresh Token 생성
  public String createRefreshToken() {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + refreshTokenValidityInMs);

    return Jwts.builder()
        .setIssuedAt(now)
        .setExpiration(expiry)
        .signWith(secretKey, SignatureAlgorithm.HS256)
        .compact();
  }

  // JWT 유효성 검증
  public boolean validateToken(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  // JWT에서 사용자 정보 추출 (providerId)
  public String getProviderId(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(secretKey)
        .build()
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

  // JWT에서 로그인 플랫폼 추출
  public AuthProviderEnum getProvider(String token) {
    String provider = (String) Jwts.parserBuilder()
        .setSigningKey(secretKey)
        .build()
        .parseClaimsJws(token)
        .getBody()
        .get("provider");

    return AuthProviderEnum.valueOf(provider);
  }
}
