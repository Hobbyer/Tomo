import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { Button } from "react-bootstrap";
import SocialLoginButtons from "../components/login/SocialLoginButtons";

const Home = () => {
  const [loginFormShow, setLoginFormShow] = useState(false);

  const handleClose = () => setLoginFormShow(false);
  const handleShow = () => setLoginFormShow(true);

  // 로그인 여부
  const isLoggedIn = sessionStorage.getItem("accessToken") !== null;
  return (
    <div className="home-container">
      {/* 상단 헤더 */}
      <header className="home-header">
        <div className="header-top">
          {/* TOMO 로고 이미지 */}
          <img
            src="/assets/favicon.png"
            alt="TOMO 로고"
            className="tomo-logo"
          />
          { isLoggedIn ? 
            <Button
            variant="outline-danger"
            className="login-btn"
            onClick={() => {
              sessionStorage.removeItem("accessToken");
              sessionStorage.removeItem("refreshToken");
              window.location.reload();
            }}
          >
            로그아웃
          </Button>
          : <Button
            variant="outline-danger"
            className="login-btn"
            onClick={handleShow}
          >
            로그인
          </Button> }
          
        </div>

        <h1>✨ TOMO ★ トモ ✨</h1>
        <p>서로의 생각이 연결되는 실시간 협업 툴 💬</p>
      </header>

      {/* 카드 영역 */}
      <main className="home-main">
        <div className="card-grid">
          <div className="card">
            <h2>📄 새 문서 만들기</h2>
            <p>자유롭게 블록을 추가하고 기록해보세요!</p>
            <Link to="/block-editor">
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
      <SocialLoginButtons loginFormShow={loginFormShow} handleClose={handleClose}/>
    </div>
  );
};

export default Home;
