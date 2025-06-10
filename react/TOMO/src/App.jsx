import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import SlateEditor from './components/SlateEditor';
import BlockEditor from './components/Editor/BlockEditor';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />


        <Route path='edit' element={<SlateEditor />} />
        <Route path='block-editor' element={<BlockEditor />} />
        
        <Route path='/auth/login' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
