import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TaskManagement from './pages/TaskManagement';
import RiskAlerts from './pages/RiskAlerts';
import HealthReports from './pages/HealthReports';
import ChatAssistant from './pages/ChatAssistant';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskManagement />} />
            <Route path="/risks" element={<RiskAlerts />} />
            <Route path="/reports" element={<HealthReports />} />
            <Route path="/chat" element={<ChatAssistant />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;