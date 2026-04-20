/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import RegisterFarmer from './pages/RegisterFarmer';
import RegisterBuyer from './pages/RegisterBuyer';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-background">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register-farmer" element={<RegisterFarmer />} />
              <Route path="/register-buyer" element={<RegisterBuyer />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1A4D2E',
                color: '#fff',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#E8DFCA',
                  secondary: '#1A4D2E',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}
