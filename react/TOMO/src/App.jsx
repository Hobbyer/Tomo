import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import SlateEditor from "./components/SlateEditor";
import BlockEditor from "./components/Editor/BlockEditor";
import SideBar from "./components/SideBar";
import Header from "./components/Header";

function App() {
  return (
    <div className="app-container">
      {/* 상단 헤더 */}
      <Header />
      {/* 왼쪽 고정 사이드바 */}
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="edit" element={<SlateEditor />} />
          <Route path="block-editor" element={<BlockEditor />} />

          <Route path="/auth/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
