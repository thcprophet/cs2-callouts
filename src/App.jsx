import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import IndexPage from './pages/IndexPage'
import MapPage from './pages/MapPage'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Navigate to="/callouts" replace />} />
        <Route path="/callouts"      element={<IndexPage />} />
        <Route path="/callouts/:mapId" element={<MapPage />} />
        <Route path="*"              element={<Navigate to="/callouts" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
