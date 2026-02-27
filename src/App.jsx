import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import FinVerseLanding from "./components/landing";
import Dashboard from "./components/dashboard/Dashboard";
import StockDetail from "./components/dashboard/StockDetail"; 
import { supabase } from "./lib/supabaseClient";

const App = () => {
  const [currentView, setCurrentView] = useState("landing"); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedStockSymbol, setSelectedStockSymbol] = useState(null);

  useEffect(() => {
    let mounted = true;

    // MASTER FAILSAFE: If the network hangs for more than 4 seconds, force the loading screen off!
    const failsafeTimer = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Network took too long. Forcing loading to close.");
        setLoading(false);
      }
    }, 4000);

    const handleSession = async (session) => {
      if (!mounted) return;

      if (session?.user) {
        try {
          // We wrap the DB fetch in a timeout so it doesn't hang the app
          const fetchPromise = supabase.from('users').select('*').eq('id', session.user.id).maybeSingle();
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 3000));
          
          const { data: userData, error } = await Promise.race([fetchPromise, timeoutPromise]);

          if (error && error.message !== 'DB Timeout') throw error;

          if (mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: userData?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              phone: userData?.phone,
              dob: userData?.date_of_birth
            });
            setCurrentView((prev) => (prev === 'auth' || prev === 'landing') ? 'dashboard' : prev);
          }
        } catch (err) {
          console.error("Profile fetch error:", err.message);
          // Fallback if DB fetch fails but user is still authenticated
          if (mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            });
            setCurrentView((prev) => (prev === 'auth' || prev === 'landing') ? 'dashboard' : prev);
          }
        } finally {
          if (mounted) setLoading(false);
        }
      } else {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Safely attempt to get the session with a catch block
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        handleSession(session);
      })
      .catch((err) => {
        console.error("Supabase getSession error:", err);
        if (mounted) setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      mounted = false;
      clearTimeout(failsafeTimer);
      subscription.unsubscribe();
    };
  }, [loading]); // Added loading to dependency array for the failsafe

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); 
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

  // --- ROUTER LOGIC ---

  if (currentView === "stockDetail" && user) {
    return (
      <StockDetail 
        stockSymbol={selectedStockSymbol} 
        onBack={() => setCurrentView("dashboard")} 
      />
    );
  }

  if (currentView === "dashboard" && user) {
    return (
      <Dashboard 
        user={user} 
        onLogout={handleLogout} 
        onHome={() => setCurrentView("landing")}
        onViewStock={(symbol) => {
          setSelectedStockSymbol(symbol);
          setCurrentView("stockDetail");
        }}
      />
    );
  }

  if (currentView === "auth" && !user) {
    return (
      <Auth 
        onBack={() => setCurrentView("landing")} 
        onLoginSuccess={() => setCurrentView("dashboard")} 
      /> 
    );
  }

  // Default
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