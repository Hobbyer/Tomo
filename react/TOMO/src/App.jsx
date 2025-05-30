import { Route, Routes } from 'react-router-dom'
import './App.css'
import Test1 from './components/Test1'
import Home from './pages/Home'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
    </>
  )
}

export default App
