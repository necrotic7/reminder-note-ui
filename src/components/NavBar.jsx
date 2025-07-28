import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/createReminder" style={{ marginRight: '1rem' }}>
        新增提醒
      </Link>
      <Link to="/about">ℹ️ 關於</Link>
    </nav>
  )
}

export default NavBar