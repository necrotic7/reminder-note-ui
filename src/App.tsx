import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import CreateReminder from './pages/CreateReminder'
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/createReminder" element={<CreateReminder/>} />
    </Routes>
  )
}

export default App