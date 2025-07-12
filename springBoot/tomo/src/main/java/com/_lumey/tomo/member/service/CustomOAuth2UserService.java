package com._lumey.tomo.member.service;

import com._lumey.tomo.member.entity.AuthProviderEnum;
import com._lumey.tomo.member.entity.MemberEntity;
import com._lumey.tomo.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

  private final MemberRepository memberRepository;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest request) {
    OAuth2User oAuth2User = super.loadUser(request);

    String registerationId = request.getClientRegistration().getRegistrationId(); // google, naver, kakao 등
    AuthProviderEnum provider = AuthProviderEnum.valueOf(registerationId.toUpperCase());

    Map<String, Object> attributes = oAuth2User.getAttributes();

    String providerId = extractProviderId(provider, attributes);
    String name = extractName(provider, attributes);
    String email = extractEmail(provider, attributes);
    String phone = extractPhone(provider, attributes);

    MemberEntity member = memberRepository.findByProviderAndProviderId(provider, providerId)
        .orElseGet(() -> memberRepository.save(MemberEntity.builder()
            .provider(provider)
            .providerId(providerId)
            .name(name)
            .email(email)
            .phoneNumber(phone)
            .build()
        ));

    return new CustomOAuth2User(member, attributes);
  }

  private String extractProviderId(AuthProviderEnum provider, Map<String, Object> attributes) {
    switch (provider) {
      case GOOGLE -> {
        return (String) attributes.get("sub"); // Google의 경우 'sub' 필드가 고유 ID
      }
      case NAVER -> {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        return (String) response.get("id"); // Naver의 경우 'id' 필드가 고유 ID
      }
      case KAKAO -> {
        return String.valueOf(attributes.get("id")); // Kakao의 경우 'id' 필드가 고유 ID
      }
    }
    throw new RuntimeException("지원하지 않는 provider 입니다: " + provider);
  }

  private String extractName(AuthProviderEnum provider, Map<String, Object> attributes) {
    if (provider == AuthProviderEnum.NAVER) {
      return (String) ((Map<String, Object>) attributes.get("response")).get("name");
    }
    if (provider == AuthProviderEnum.KAKAO) {
      Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
      Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
      return (String) profile.get("nickname");
    }
    return (String) attributes.get("name");
  }

  private String extractEmail(AuthProviderEnum provider, Map<String, Object> attributes) {
    if (provider == AuthProviderEnum.NAVER) {
      return (String) ((Map<String, Object>) attributes.get("response")).get("email");
    }
    if (provider == AuthProviderEnum.KAKAO) {
      Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
      return (String) kakaoAccount.get("email");
    }
    return (String) attributes.get("email"); // Google의 경우 'email' 필드가 이메일
  }

  private String extractPhone(AuthProviderEnum provider, Map<String, Object> attributes) {
    if (provider == AuthProviderEnum.NAVER) {
      return (String) ((Map<String, Object>) attributes.get("response")).get("mobile");
    }
    if (provider == AuthProviderEnum.KAKAO) {
      Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
      return (String) kakaoAccount.get("phone_number");
    }
    return null; // Google은 전화번호를 제공하지 않음
  }

}
