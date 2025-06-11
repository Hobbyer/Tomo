import React from 'react'
import './SideBar.css';
import { Offcanvas } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

  const menuItems = [
  { section: "워크스페이스", items: [
    { icon: "🏠", label: "홈", path: "/" },
    { icon: "📄", label: "내 문서", path: "/my-docs" },
    { icon: "⭐", label: "즐겨찾기", path: "/favorites" },
    { icon: "👥", label: "공유 문서", path: "/shared" },
  ]},
  { section: "새로 만들기", items: [
    { icon: "➕", label: "새 문서 만들기", path: "/create" },
    { icon: "📚", label: "템플릿 갤러리", path: "/templates" },
  ]},
  { section: "설정", items: [
    { icon: "👤", label: "내 프로필", path: "/profile" },
    { icon: "⚙️", label: "환경 설정", path: "/settings" },
    { icon: "🚪", label: "로그아웃", path: "/logout" },
  ]},
];

const SideBar = () => {
  const location = useLocation();
  

  return (
    <Offcanvas
      show={true}
      backdrop={false}
      scroll={true}
      responsive="lg"
      className="offcanvas-fixed"
      placement="start"
    >
      <Offcanvas.Header>
        <Offcanvas.Title>🌟 TOMO</Offcanvas.Title>
        
      </Offcanvas.Header>
      <Offcanvas.Body>
        {menuItems.map((section, idx) => (
          <div key={idx} className="sidebar-section">
            <div className="section-title">{section.section}</div>
            <ul className="sidebar-list">
              {section.items.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.path}
                    className={`sidebar-link ${
                      location.pathname === item.path ? "active" : ""
                    }`}
                  >
                    <span className="icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default SideBar