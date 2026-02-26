import React, { useState } from "react";
import Auth from "./components/Auth";
import FinVerseLanding from "./components/landing";

const App = () => {
  const [showAuth, setShowAuth] = useState(false);

  const openAuth = () => setShowAuth(true);
  const backToLanding = () => setShowAuth(false);

  // showAuth could also control whether Auth renders with props to switch back
  return showAuth ? (
    <Auth onBack={backToLanding} />
  ) : (
    <FinVerseLanding onLogin={openAuth} onGetStarted={openAuth} />
  );
};

export default App;