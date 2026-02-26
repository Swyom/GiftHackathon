import React, { useState } from "react";
import Auth from "./components/Auth";
import FinVerseLanding from "./components/landing";
import Dashboard from "./components/dashboard/Dashboard";

const App = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  const openAuth = () => setShowAuth(true);
  const backToLanding = () => setShowAuth(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  // if a user is logged in, show the dashboard directly
  if (user) {
    return <Dashboard user={user} onLogout={() => setUser(null)} />;
  }

  return showAuth ? (
    <Auth onBack={backToLanding} onLoginSuccess={handleLoginSuccess} />
  ) : (
    <FinVerseLanding onLogin={openAuth} onGetStarted={openAuth} />
  );
};

export default App;