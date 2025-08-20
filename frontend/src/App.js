import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Donors from './components/Donors';
import BloodInventory from './components/BloodInventory';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/inventory" element={<BloodInventory />} />
          <Route path="/hospitals" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Hospitals Management - Coming Soon</h2></div>} />
          <Route path="/reports" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Reports & Analytics - Coming Soon</h2></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
