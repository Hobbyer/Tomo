import { Route, Routes } from 'react-router-dom'
import './App.css'
import Test1 from './components/Test1'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Test1 />} />
      </Routes>
    </>
  )
}

export default App
