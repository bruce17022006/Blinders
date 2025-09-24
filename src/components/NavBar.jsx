import { Link, NavLink } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore.js'

export default function NavBar() {
  const points = useAppStore((s) => s.points)

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-gray-900">
          <span>SDG Explorer</span>
        </Link>

        <nav className="flex items-center gap-6">
          <div className="text-sm font-medium text-gray-700">Points: <span className="font-bold text-indigo-600">{points}</span></div>
          <NavLink to="/" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-gray-700 hover:text-gray-900'}`}>Home</NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-gray-700 hover:text-gray-900'}`}>LeaderBoard</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-gray-700 hover:text-gray-900'}`}>Profile</NavLink>
        </nav>
      </div>
    </header>
  )
}
