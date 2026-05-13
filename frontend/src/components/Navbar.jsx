import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, FileText, Clock, LayoutDashboard } from 'lucide-react'

export default function Navbar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">Resume<span>AI</span></div>
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <LayoutDashboard size={15} style={{ verticalAlign:'middle', marginRight:4 }} />Dashboard
          </NavLink>
          <NavLink to="/analyze" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <FileText size={15} style={{ verticalAlign:'middle', marginRight:4 }} />Analyze
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Clock size={15} style={{ verticalAlign:'middle', marginRight:4 }} />History
          </NavLink>
          <span className="nav-user">{user?.full_name || user?.email}</span>
          <button className="btn btn-outline" style={{ padding:'6px 14px' }} onClick={() => { logoutUser(); navigate('/login') }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </nav>
  )
}