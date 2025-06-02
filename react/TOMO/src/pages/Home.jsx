// src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>✨ TOMO ★ トモ ✨</h1>
        <p>서로의 생각이 연결되는 실시간 협업 툴 💬</p>
      </header>

      <main className="home-main">
        <div className="card-grid">
          <div className="card">
            <h2>📝 문서 작성</h2>
            <p>새 문서를 블럭 기반으로 작성해보세요!</p>
            <Link to="/editor">
              <button>작성하러 가기 →</button>
            </Link>
          </div>
          <div className="card">
            <h2>📂 내 문서 목록</h2>
            <p>작성한 문서들을 모아볼 수 있어요!</p>
            <Link to="/documents">
              <button>보러 가기 →</button>
            </Link>
          </div>
          <div className="card">
            <h2>👥 실시간 협업</h2>
            <p>초대된 사용자와 함께 편집해보세요!</p>
            <Link to="/collab">
              <button>협업 시작 →</button>
            </Link>
          </div>
          <div className="card">
            <h2>📊 활동 로그</h2>
            <p>최근 작성 내역과 편집 로그를 확인할 수 있어요!</p>
            <Link to="/logs">
              <button>활동 보기 →</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
