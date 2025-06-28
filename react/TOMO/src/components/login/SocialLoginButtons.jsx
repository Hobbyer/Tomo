import React from 'react'
import { Button, Modal } from 'react-bootstrap';

const SocialLoginButtons = ({ loginFormShow, handleClose }) => {

  const redirectTo = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
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