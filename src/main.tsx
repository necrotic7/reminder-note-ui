import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import liff from '@line/liff';
import { BrowserRouter } from 'react-router-dom';

async function initLiff() {
    try {
        await liff.init({ liffId: import.meta.env.VITE_LINE_LIFF_ID }); // 這裡填你在 LINE Developer 建好的 LIFF ID
        console.log('LIFF 初始化成功');
    } catch (err) {
        console.error('LIFF 初始化失敗', err);
    }
}
initLiff();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>,
);
