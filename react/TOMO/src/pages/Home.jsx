// src/pages/Home.jsx
import React from 'react'
import './Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>✨ TOMO ✨</h1>
        <p>솜사탕처럼 달콤한 나만의 노트 🩷💙</p>
      </header>

      <main className="home-main">
        <div className="card">
          <h2>📄 새 페이지 만들기</h2>
          <p>자유롭게 블럭을 추가하고 정리해보세요!</p>
          <button>시작하기 →</button>
        </div>
      </main>
    </div>
  )
}

export default Home
