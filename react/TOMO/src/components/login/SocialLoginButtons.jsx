import React from 'react'
import { Button, Modal } from 'react-bootstrap';

const SocialLoginButtons = ({ loginFormShow, handleClose }) => {

  const redirectTo = (provider) => {
    // 플랫폼 이름 정리
    const supportedProviders = ["google", "naver", "kakao"];
    if (!supportedProviders.includes(provider)) {
      console.error("지원하지 않는 소셜 로그인 플랫폼입니다.");
      return;
    }

    // 리다이렉트 URL 생성
    // 실제 환경에서는 백엔드 서버의 OAuth2 엔드포인트로 리다이렉트해야 합니다.
    const redirectUrl = `http://localhost:8080/oauth2/authorization/${provider}`;
    window.location.href = redirectUrl;
  };

  return (
    <Modal show={loginFormShow} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>소셜 로그인</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-3">
          <Button
            className="google-btn d-flex align-items-center gap-2 justify-content-center"
            onClick={() => redirectTo("google")}
          >
            <img
              src="/assets/google.png"
              alt="Google"
              style={{ width: "20px", height: "20px" }}
            />
            Google로 로그인
          </Button>

          <Button
            className="naver-btn d-flex align-items-center gap-2 justify-content-center"
            onClick={() => redirectTo("naver")}
          >
            <img
              src="/assets/naver.png"
              alt="Naver"
              style={{ width: "25px", height: "25px" }}
            />
            Naver로 로그인
          </Button>

          <Button
            className="kakao-btn d-flex align-items-center gap-2 justify-content-center"
            onClick={() => redirectTo("kakao")}
          >
            <img
              src="/assets/kakao.png"
              alt="Kakao"
              style={{ width: "25px", height: "25px" }}
            />
            Kakao로 로그인
          </Button>
        </Modal.Body>
      </Modal>
  );
};

export default SocialLoginButtons