import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import VehicleDetailPage from './pages/VehicleDetailPage/VehicleDetailPage'
import ApplyForFinancing from './pages/ApplyForFinancing/ApplyForFinancing'
import SellYourCarPage from './pages/SellYourCarPage/SellYourCarPage'
import AboutUsPage from './pages/AboutUsPage/AboutUsPage'
import AdminInventoryPage from './pages/AdminInventory/AdminInventoryPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="inventory/:id" element={<VehicleDetailPage />} />
        <Route path="apply-for-financing" element={<ApplyForFinancing />} />
        <Route path="sell-your-car" element={<SellYourCarPage />} />
        <Route path="about-us" element={<AboutUsPage />} />
        <Route path="admin/inventory" element={<AdminInventoryPage />} />
      </Route>
    </Routes>
  )
}
