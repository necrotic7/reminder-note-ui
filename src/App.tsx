import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import CreateReminder from './pages/CreateReminder'
import MainLayout from './components/MainLayout'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="/createReminder" element={<CreateReminder/>} />
        <Route path="/home" element={<Home/>} />
      </Route>
    </Routes>
  )
}

export default App