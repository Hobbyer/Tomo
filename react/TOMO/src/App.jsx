import { Route, Routes } from 'react-router-dom'
import './App.css'
import Test1 from './components/Test1'
import Home from './pages/Home'
import SlateTest2 from './components/testfile/SlateTest2'
import 'bootstrap/dist/css/bootstrap.min.css'
import EditorPage from './components/EditorPage'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/test1' element={<Test1 />} />
        <Route path='/slate-test2' element={<SlateTest2 />} />

        <Route path="editor" element={<EditorPage />} />
      </Routes>
    </>
  )
}

export default App
