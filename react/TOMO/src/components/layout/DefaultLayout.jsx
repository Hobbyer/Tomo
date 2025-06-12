import React from "react";
import Header from "../Header";
import SideBar from "../SideBar";
import { Outlet } from "react-router-dom";

const DefaultLayout = ({ show, setShow, toggleSidebar }) => {

  const sidebarOpen = (show ? "sidebar-open" : "none");

  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <div className="layout-body">
        {/* 사이드바 영역 */}
        {show && (
          <SideBar show={show} setShow={setShow} />
        )}
        {/* 페이지 콘텐츠 영역 */}
        <div className={sidebarOpen}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
