import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StudioPage from './pages/StudioPage';
import RoyaltyPage from './pages/RoyaltyPage';
import ContractsPage from './pages/ContractsPage';
import MarketplacePage from './pages/MarketplacePage';
import DistributionPage from './pages/DistributionPage';
import BillingPage from './pages/BillingPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/studio" element={<StudioPage />} />
      <Route path="/royalty" element={<RoyaltyPage />} />
      <Route path="/contracts" element={<ContractsPage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/distribution" element={<DistributionPage />} />
      <Route path="/billing" element={<BillingPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
