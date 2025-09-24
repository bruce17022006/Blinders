import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Home from './pages/Home.jsx'
import LeaderBoard from './pages/LeaderBoard.jsx'
import Profile from './pages/Profile.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <footer className="py-8 text-center text-xs text-gray-500">© SDG Explorer</footer>
    </div>
  )
}
