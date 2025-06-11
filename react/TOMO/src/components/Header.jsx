import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const pathMap = {
  '/': '홈',
  '/my-docs': '내 문서',
  '/create': '새 문서 만들기',
  '/block-editor': '블록 에디터',
  '/profile': '내 프로필',
  '/settings': '환경 설정',
};

const Header = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean); // ['', 'my-docs'] → ['my-docs']

  const breadcrumb = segments.map((segment, idx) => {
    const path = '/' + segments.slice(0, idx + 1).join('/');
    
    return {
      label: pathMap[path] || segment,
      path,
      isLast: idx === segments.length - 1,
    };
  });

  return (
    <div className="breadcrumb-bar">
      <span className="emoji">📁</span>
      <Link to="/">홈</Link>
      {breadcrumb.map((b, i) => (
        <span key={i}>
          <span className="divider"> / </span>
          {b.isLast ? (
            <span className="current">{b.label}</span>
          ) : (
            <Link to={b.path}>{b.label}</Link>
          )}
        </span>
      ))}
    </div>
  )
}

export default Header