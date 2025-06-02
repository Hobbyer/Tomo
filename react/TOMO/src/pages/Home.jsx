import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { Button, Modal } from "react-bootstrap";

const Home = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSocialLogin = (provider) => {
    alert(`${provider} 로그인 시도 !`);
    // 실제 OAuth 주소 연결 가능: window.location.href = `...`
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-top">
          <Button
            variant="outline-danger"
            className="login-btn"
            onClick={handleShow}
          >
            로그인
          </Button>
        </div>
        <h1>✨ TOMO ★ トモ ✨</h1>
        <p>서로의 생각이 연결되는 실시간 협업 툴 💬</p>
      </header>

      <main className="home-main">
        <div className="card-grid">
          <div className="card">
            <h2>📄 새 문서 만들기</h2>
            <p>자유롭게 블록을 추가하고 기록해보세요!</p>
            <Link to="/editor">
              <button>시작하기</button>
            </Link>
          </div>
          <div className="card">
            <h2>📂 내 문서 보기</h2>
            <p>작성한 문서를 한눈에 확인할 수 있어요</p>
            <Link to="/documents">
              <button>보러가기</button>
            </Link>
          </div>
          <div className="card">
            <h2>👥 함께 쓰는 문서</h2>
            <p>초대받은 문서를 실시간으로 편집해요!</p>
            <Link to="/invite">
              <button>협업하러 가기</button>
            </Link>
          </div>
          <div className="card">
            <h2>📊 활동 내역</h2>
            <p>내가 작성한 히스토리를 볼 수 있어요</p>
            <Link to="/logs">
              <button>열어보기</button>
            </Link>
          </div>
        </div>
      </main>

      {/* ✅ 모달 시작 */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>소셜 로그인</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-3">
          <Button
            className="google-btn d-flex align-items-center gap-2 justify-content-center"
            onClick={() => handleSocialLogin("google")}
          >
            <img src="/assets/google.png" alt="Google" style={{ width: '20px', height: '20px' }} />
            Google로 로그인
          </Button>

          <Button
            className="naver-btn d-flex align-items-center gap-2 justify-content-center"
            onClick={() => handleSocialLogin("naver")}
          >
            <img src="/assets/naver.png" alt="Naver" style={{ width: '25px', height: '25px' }} />
            Naver로 로그인
          </Button>

          <Button
            className="kakao-btn d-flex align-items-center gap-2 justify-content-center"
            onClick={() => handleSocialLogin("kakao")}
          >
            <img src="/assets/kakao.png" alt="Kakao" style={{ width: '25px', height: '25px' }} />
            Kakao로 로그인
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Home;
