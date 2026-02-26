import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from "./components/Auth";
import FinVerseLanding from "./components/landing";
import Layout from "./components/Layout";
import Dashboard from "./components/dashboard/Dashboard";
import Portfolio from "./components/dashboard/Portfolio";
import Trading from "./components/Trading";
import NewsPage from "./components/NewsPage";
import Tutorial from "./components/Tutorial";

const App = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  const openAuth = () => setShowAuth(true);
  const backToLanding = () => setShowAuth(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  // if a user is logged in, show router with layout and pages
  if (user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Layout user={user} onLogout={() => setUser(null)} />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard user={user} />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="trading" element={<Trading />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="tutorial" element={<Tutorial />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    );
  }

  return showAuth ? (
    <Auth onBack={backToLanding} onLoginSuccess={handleLoginSuccess} />
  ) : (
    <FinVerseLanding onLogin={openAuth} onGetStarted={openAuth} />
  );
};

export default App;