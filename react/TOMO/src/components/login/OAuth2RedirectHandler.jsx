import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const OAuth2RedirectHandler = () => {

const navigate = useNavigate();

useEffect(() => {
  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get("access");
  const refreshToken = url.searchParams.get("refresh");

  if (accessToken) {
    sessionStorage.setItem("accessToken", accessToken);
  }

  // 이후 refreshToken 은 서버 측에 저장할 예정

  navigate('/'); // 로그인 후 홈으로 리다이렉트
}, [navigate]);

  return (
    <div>로그인 중입니다...</div>
  )
}

export default OAuth2RedirectHandler