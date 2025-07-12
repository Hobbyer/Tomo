import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import SlateEditor from "./components/SlateEditor";
import BlockEditor from "./components/Editor/BlockEditor";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import { useState } from "react";
import DefaultLayout from "./components/layout/DefaultLayout";
import Block from "./components/editor/Block";
import NotionStyleEditor from "./components/editor/NotionStyleEditor";
import OAuth2RedirectHandler from "./components/login/OAuth2RedirectHandler";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="App">
      <Routes>
        <Route element={<DefaultLayout show={showSidebar} setShow={setShowSidebar} toggleSidebar={() => setShowSidebar(!showSidebar)} />} >
          <Route
            path="/"
            element={<Home />}
          />
          <Route path="/oauth2/success" element={<OAuth2RedirectHandler />} />
          <Route path="/editor" element={<SlateEditor />} />
          <Route path="/block-editor" element={<NotionStyleEditor />} />
          <Route path="/my-docs" element={<div>내 문서 페이지</div>} />
          <Route path="/create" element={<div>새 문서 만들기 페이지</div>} />
          <Route path="/profile" element={<div>내 프로필 페이지</div>} />
          <Route path="/settings" element={<div>환경 설정 페이지</div>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
