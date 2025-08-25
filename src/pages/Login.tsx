import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import liff from '@line/liff';
import { EnumLocalStorageKey } from '../consts/localStorage';

function LoginPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                // 初始化 LIFF
                await liff.init({ liffId: import.meta.env.VITE_LINE_LIFF_ID });

                // 等待 LIFF 完全就緒
                await new Promise((resolve) => setTimeout(resolve, 200));

                // 檢查登入狀態
                let isLoggedIn = liff.isLoggedIn();

                if (isLoggedIn) {
                    const profile = await liff.getProfile();
                    localStorage.setItem(EnumLocalStorageKey.LineID, profile.userId);
                    navigate('/');
                } else {
                    setIsLoading(false);
                }
            } catch (err) {
                if (
                    err.message.includes('invalid authorization code') ||
                    err.message.includes('authorization')
                ) {
                    console.log('忽略 authorization code 錯誤');
                    init();
                } else {
                    console.error('LIFF 初始化失敗:', err);
                    setError(`初始化失敗: ${err.message}`);
                    setIsLoading(false);
                }
            }
        };

        init();
        return;
    }, [navigate]);

    const handleLogin = useCallback(() => {
        try {
            liff.login();
        } catch (err) {
            console.error('登入失敗:', err);
            setError(`登入失敗: ${err.message}`);
        }
    }, []);

    if (error) {
        return (
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <div className="alert alert-error shadow-lg mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-current flex-shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <h3 className="font-bold">發生錯誤！</h3>
                                <div className="text-xs">{error}</div>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary btn-wide"
                            onClick={() => window.location.reload()}
                        >
                            重新整理頁面
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                        <h1 className="text-2xl font-bold text-base-content">
                            載入中...
                        </h1>
                        <p className="py-2 text-base-content/70">
                            正在初始化 LINE 登入服務
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <div className="mb-8">
                        <div className="avatar placeholder mb-4">
                            <div className="bg-primary text-primary-content rounded-full w-16">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771z" />
                                    <path d="M12.012 0C5.389 0 .12 4.183.12 9.333v5.334A9.32 9.32 0 009.428 24h5.168A9.32 9.32 0 0023.904 14.667V9.333C23.904 4.183 18.635 0 12.012 0z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-4xl font-bold text-base-content mb-2">
                            歡迎使用 提醒助手
                        </h2>
                        <p className="text-base-content/70 mb-6">
                            請使用 LINE 帳號登入以繼續使用服務
                        </p>
                    </div>
                    <div className="card w-full max-w-sm shadow-xl bg-base-100">
                        <div className="card-body items-center text-center">
                            <button
                                className="btn btn-success btn-wide gap-2"
                                onClick={handleLogin}
                            >
                                LINE 登入
                            </button>
                            <div className="divider text-xs text-base-content/50">
                                安全快速登入
                            </div>
                            <p className="text-xs text-base-content/60">
                                使用 LINE 帳號，無需另外註冊
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
