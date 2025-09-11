import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import CreateReminder from './pages/CreateReminder';
import MainLayout from './components/common/MainLayout';
import Home from './pages/Home';
import ReminderList from './pages/ReminderList';
import { useEffect } from 'react';
import { EnumLocalStorageKey } from './consts/localStorage';
import { ConfigProvider, theme } from 'antd';

function App() {
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
    }, []);

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
            }}
        >
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={
                <AuthRoute>
                    <MainLayout />
                </AuthRoute>}>
                <Route path="/createReminder" element={<CreateReminder />} />
                <Route path="/" element={<Home />} />
                <Route path="/reminderList" element={<ReminderList />} />
            </Route>
        </Routes>
        </ConfigProvider>
    );
}

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const lineId = localStorage.getItem(EnumLocalStorageKey.LineID);

    useEffect(() => {
        if (!lineId) {
            navigate('/login');
        }
    }, [lineId, navigate]);

    return lineId ? <>{children}</> : null;
};

export default App;
