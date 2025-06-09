import { Route, Routes } from 'react-router-dom';
import './App.css';
import Test1 from './components/Test1';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditorPage from './components/EditorPage';
import Login from './pages/Login';
import SlateEditor from './components/SlateEditor';
import BlockEditor from './components/Editor/BlockEditor';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/test1' element={<Test1 />} />

        <Route path="editor" element={<EditorPage />} />

        <Route path='edit' element={<SlateEditor />} />
        <Route path='block-editor' element={<BlockEditor />} />
        
        <Route path='/auth/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
