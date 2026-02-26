import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import FinVerseLanding from "./components/landing";
import Dashboard from "./components/dashboard/Dashboard";
import { supabase } from "./lib/supabaseClient";

const App = () => {
  const [currentView, setCurrentView] = useState("landing"); // "landing", "auth", "dashboard"
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // This function handles everything: fetching the profile AND setting the view
    const handleSession = async (session) => {
      if (session?.user) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: userData?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              phone: userData?.phone,
              dob: userData?.date_of_birth
            });
            // If they just logged in from the Auth screen, force them to the Landing Page!
            setCurrentView((prevView) => prevView === 'auth' ? 'landing' : prevView);
          }
        } catch (err) {
          console.error("Profile fetch error, using fallback data.");
          if (mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            });
            setCurrentView((prevView) => prevView === 'auth' ? 'landing' : prevView);
          }
        }
      } else {
        if (mounted) setUser(null);
      }
      if (mounted) setLoading(false);
    };

    // 1. Check if user is already logged in on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // 2. The Global Listener: Detects logins, logouts, and mobile email verifications automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView("landing");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-white text-xl font-semibold">Loading FinVerse...</div>
      </div>
    );
  }

  // ROUTER LOGIC
  if (currentView === "dashboard" && user) {
    return <Dashboard user={user} onLogout={handleLogout} onHome={() => setCurrentView("landing")} />;
  }

  if (currentView === "auth" && !user) {
    return <Auth onBack={() => setCurrentView("landing")} />; 
  }

  // DEFAULT VIEW: The Landing Page
  return (
    <FinVerseLanding 
      user={user}
      onLogin={() => setCurrentView("auth")}
      onGetStarted={() => setCurrentView("auth")}
      onGoToDashboard={() => setCurrentView("dashboard")}
      onLogout={handleLogout}
    />
  );
};

export default App;