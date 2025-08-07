import { Link, Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className="drawer lg:drawer-open">
      {/* Drawer Toggle 控制 */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* 畫面主要內容區 */}
      <div className="drawer-content flex flex-col">
        {/* Navbar 放最上面 */}
        <div className="navbar bg-base-100 shadow-sm">
          {/* 左側：漢堡按鈕（只有在小螢幕出現） */}
          <div className="navbar-start">
            <label htmlFor="my-drawer" className="btn btn-ghost btn-circle lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </label>
          </div>

          {/* 中央：Logo 或標題 */}
          <div className="navbar-center">
            <Link to="/" className="btn btn-ghost text-xl">
              Reminder
            </Link>
          </div>

          {/* 右側：可以放設定、帳號之類 */}
          <div className="navbar-end">{/* TODO: 放右側按鈕 */}</div>
        </div>

        {/*  主內容畫面 */}
        <main className="p-4">
          <div className="max-w-4xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/*  Drawer 側邊欄 */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-64 p-4">
          <li><Link to="/home">🏠 首頁</Link></li>
          <li><Link to="/createReminder">📝 新增提醒</Link></li>
          <li><Link to="/reminderList">ℹ️ 提醒清單</Link></li>
        </ul>
      </div>
      {/* toast提示窗 */}
      <div className="alert alert-success alert-error alert-info hidden" />
      <div className="toast z-50 toast-top toast-end" id="toast-container"></div>
    </div>
  )
}