package com._lumey.tomo.oauth2;

import com._lumey.tomo.jwt.JwtTokenProvider;
import com._lumey.tomo.member.entity.MemberEntity;
import com._lumey.tomo.member.service.CustomOAuth2User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

  private final JwtTokenProvider jwtTokenProvider;

  private static final String REDIRECT_URI = "http://localhost:5173/oauth2/success";

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
    // OAuth2 인증 후 사용자 정보 꺼내기
    CustomOAuth2User oauthUser = (CustomOAuth2User) authentication.getPrincipal();
    MemberEntity member = oauthUser.getMember();

    // JWT 토큰 생성
    String accessToken = jwtTokenProvider.createAccessToken(member.getProviderId(), member.getProvider());
    String refreshToken = jwtTokenProvider.createRefreshToken();

    // ✅ 추후 refreshToken 저장 로직 추가 가능 (DB/Redis)

    // ✅ 프론트엔드로 리다이렉트
    String targetUrl = REDIRECT_URI
        + "?access=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8)
        + "&refresh=" + URLEncoder.encode(refreshToken, StandardCharsets.UTF_8);

    response.sendRedirect(targetUrl);
  }
}
