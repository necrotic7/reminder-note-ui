import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import CreateReminder from './pages/CreateReminder';
import MainLayout from './components/common/MainLayout';
import Home from './pages/Home';
import ReminderList from './pages/ReminderList';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<MainLayout />}>
                <Route path="/createReminder" element={<CreateReminder />} />
                <Route path="/" element={<Home />} />
                <Route path="/reminderList" element={<ReminderList />} />
            </Route>
        </Routes>
    );
}

export default App;
