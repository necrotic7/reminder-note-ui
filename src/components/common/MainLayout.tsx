import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import liff from '@line/liff';

function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        // 可以加個確認對話框
        if (window.confirm('確定要登出嗎？')) {
            liff.logout();
            navigate('/');
        }
    };

    // 判斷當前路由是否為活躍狀態
    const isActive = (path) => location.pathname === path;

    return (
        <div className="drawer lg:drawer-open">
            {/* Drawer Toggle 控制 */}
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />

            {/* 畫面主要內容區 */}
            <div className="drawer-content flex flex-col min-h-screen">
                {/* Enhanced Navbar */}
                <div className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-30 shadow-sm backdrop-blur-lg">
                    {/* 左側：漢堡按鈕 */}
                    <div className="navbar-start">
                        <label
                            htmlFor="my-drawer"
                            className="btn btn-ghost btn-circle lg:hidden"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h7"
                                />
                            </svg>
                        </label>
                    </div>

                    {/* 中央：Logo 或標題 */}
                    <div className="navbar-center">
                        <Link
                            to="/home"
                            className="btn btn-ghost text-xl font-bold text-primary"
                        >
                            <span className="hidden sm:inline">📋 </span>
                            Reminder
                        </Link>
                    </div>

                    {/* 右側：用戶功能區 */}
                    <div className="navbar-end">
                        {/* 通知按鈕 */}
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle"
                            >
                                <div className="indicator">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 17h5l-5 5v-5zM9 7V3a3 3 0 013-3H3a3 3 0 003 3v4h3z"
                                        />
                                    </svg>
                                    <span className="badge badge-xs badge-primary indicator-item"></span>
                                </div>
                            </div>
                            <div
                                tabIndex={0}
                                className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
                            >
                                <div className="card-body">
                                    <span className="font-bold text-lg">
                                        通知
                                    </span>
                                    <span className="text-info">
                                        你有新的提醒事項
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 主內容畫面 */}
                <main className="flex-1 bg-base-200 p-4 lg:p-6">
                    <div className="max-w-6xl w-full mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Footer */}
                <footer className="footer footer-center p-4 bg-base-300 text-base-content border-t border-base-300">
                    <aside>
                        <p className="font-semibold">Reminder App</p>
                        <p className="text-xs opacity-70">
                            讓生活更有條理 © 2025
                        </p>
                    </aside>
                </footer>
            </div>

            {/* Enhanced Drawer 側邊欄 */}
            <div className="drawer-side z-40">
                <label
                    htmlFor="my-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>
                <aside className="bg-base-200 min-h-full w-64 flex flex-col">
                    {/* Sidebar Header */}
                    <div className="bg-primary text-primary-content p-4">
                        <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                                <div className="bg-primary-content text-primary rounded-full w-10">
                                    <span className="text-lg">👤</span>
                                </div>
                            </div>
                            <div>
                                <div className="font-bold">歡迎使用</div>
                                <div className="text-sm opacity-90">
                                    Reminder App
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <ul className="menu p-4 flex-1">
                        <li className="menu-title">
                            <span>主要功能</span>
                        </li>
                        <li>
                            <Link
                                to="/home"
                                className={isActive('/home') ? 'active' : ''}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                首頁
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/createReminder"
                                className={
                                    isActive('/createReminder') ? 'active' : ''
                                }
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                新增提醒
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/reminderList"
                                className={
                                    isActive('/reminderList') ? 'active' : ''
                                }
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                                提醒清單
                            </Link>
                        </li>

                        <li className="menu-title mt-4">
                            <span>其他選項</span>
                        </li>
                        <li>
                            <a>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                設定
                            </a>
                        </li>
                    </ul>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-base-300">
                        <button
                            onClick={handleLogout}
                            className="btn btn-outline btn-error w-full gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            登出
                        </button>
                    </div>
                </aside>
            </div>

            {/* Enhanced Toast Container */}
            <div
                className="toast toast-top toast-end z-50"
                id="toast-container"
            ></div>
        </div>
    );
}

export default MainLayout;
