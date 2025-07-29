import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import CreateReminder from './pages/CreateReminder'
import MainLayout from './components/MainLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="/createReminder" element={<CreateReminder/>} />
      </Route>
    </Routes>
  )
}

export default App