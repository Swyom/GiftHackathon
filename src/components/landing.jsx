import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, BookOpen, TrendingUp, BarChart3, Users, Zap, Search, PieChart, ShieldCheck } from 'lucide-react';

const FinVerseLanding = ({ user, onLogin, onGetStarted, onGoToDashboard, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const NavLink = ({ href, children }) => (
    <a href={href} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors">
      {children}
    </a>
  );

  // Safe fallback for user data
  const displayName = user?.name || 'Trader';
  const displayInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <nav className="fixed w-full z-50 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl border-b border-black/5 dark:border-white/5 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg shadow-lg shadow-emerald-500/20" />
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                FinVerse
              </span>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#how-it-works">How It Works</NavLink>
              <NavLink href="#dashboard">Modules</NavLink>
              <NavLink href="#community">Community</NavLink>
            </div>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {/* Dynamic Auth Buttons - Here is where it changes if Logged In! */}
              {user ? (
                <div className="hidden sm:flex items-center gap-4">
                  <button 
                    onClick={onGoToDashboard}
                    className="px-5 py-2 text-sm font-medium border border-emerald-500 text-emerald-600 dark:text-emerald-400 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition"
                  >
                    Dashboard
                  </button>
                  <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-white/10">
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {displayInitial}
                    </div>
                    <button onClick={onLogout} className="text-sm font-medium text-slate-500 hover:text-red-500 transition">
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={onLogin}
                    className="hidden sm:block px-5 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={onGetStarted}
                    className="hidden sm:block px-5 py-2 text-sm font-medium bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full text-white shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
                  >
                    Get Started
                  </button>
                </>
              )}
              
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-black/10 dark:border-white/10 px-4 py-6 flex flex-col space-y-4">
            <a href="#features" className="text-lg" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="text-lg" onClick={() => setIsMenuOpen(false)}>How It Works</a>
            <a href="#dashboard" className="text-lg" onClick={() => setIsMenuOpen(false)}>Modules</a>
            <a href="#community" className="text-lg" onClick={() => setIsMenuOpen(false)}>Community</a>
            
            {user ? (
              <div className="pt-4 border-t border-black/10 dark:border-white/10">
                <div className="flex items-center gap-3 mb-4 px-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {displayInitial}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{displayName}</p>
                    <p className="text-sm text-slate-500">{user?.email || 'Logged in'}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsMenuOpen(false); onGoToDashboard(); }}
                  className="w-full py-3 mb-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl font-bold border border-emerald-500/20"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); onLogout(); }}
                  className="w-full py-3 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl font-bold border border-red-500/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setIsMenuOpen(false); onGetStarted(); }}
                className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold"
              >
                Get Started
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[100px] -z-10 rounded-full translate-x-[-50%] translate-y-[-50%]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] -z-10 rounded-full translate-x-[50%] translate-y-[50%]" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal opacity-0 translate-y-8 transition-all duration-700 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight text-slate-900 dark:text-white mb-6">
              Learn. Predict.<br />
              <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
                Analyze. Strategize.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
              An AI-powered financial ecosystem that bridges education, real-time market intelligence, and personalized strategy.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <button 
                onClick={user ? onGoToDashboard : onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-xl font-bold text-white shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
              >
                {user ? 'Enter Dashboard' : 'Start Learning'}
              </button>
              <button className="px-8 py-4 bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                Explore Playground
              </button>
            </div>
          </div>

          {/* Abstract UI Mockup */}
          <div className="relative reveal opacity-0 translate-y-8 transition-all duration-700 delay-200 hidden lg:block">
            <div className="animate-bounce bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2 mb-6 border-b border-black/5 dark:border-white/10 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-1/2" />
                <div className="grid grid-cols-3 gap-3">
                  {[40, 70, 50].map((h, i) => (
                    <div key={i} className="h-24 bg-slate-100 dark:bg-white/5 rounded-lg flex flex-col justify-end p-2 border border-black/5 dark:border-white/5">
                      <div className="bg-emerald-500/40 rounded w-full transition-all duration-1000" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
                <div className="h-4 bg-slate-200 dark:bg-white/10 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/30 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 reveal opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Intelligence Modules</h2>
            <p className="text-slate-600 dark:text-slate-400">Institutional-grade tools reimagined for everyone.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<BookOpen className="text-emerald-500" />} title="Learning Hub" desc="Master complex markets through AI-curated interactive paths." />
            <FeatureCard icon={<TrendingUp className="text-cyan-500" />} title="Predictive Models" desc="Deep learning forecasting based on multi-dimensional data." delay="delay-100" />
            <FeatureCard icon={<BarChart3 className="text-indigo-500" />} title="Portfolio Audit" desc="Instant risk assessment and automated diversification logic." delay="delay-200" />
            <FeatureCard icon={<PieChart className="text-purple-500" />} title="Risk Analysis" desc="Advanced risk metrics and stress testing scenarios." delay="delay-300" />
            <FeatureCard icon={<ShieldCheck className="text-orange-500" />} title="Smart Alerts" desc="AI-powered notifications for market opportunities." delay="delay-400" />
            <FeatureCard icon={<Users className="text-pink-500" />} title="Community Insights" desc="Learn from top traders and share strategies." delay="delay-500" />
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="how-it-works" className="py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 reveal opacity-0 translate-y-8 transition-all duration-700">The Intelligence Cycle</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StepCard number="01" title="Learn" text="Master financial theory." color="border-emerald-500" />
            <StepCard number="02" title="Predict" text="AI projects outcomes." color="border-cyan-500" />
            <StepCard number="03" title="Analyze" text="Verify with raw data." color="border-indigo-500" />
            <StepCard number="04" title="Optimize" text="Refine for performance." color="border-purple-500" />
          </div>
        </div>
      </section>

      {/* Community / Stats */}
      <section id="community" className="py-24 bg-slate-900 text-white px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <Stat value="50k+" label="Active Traders" />
          <Stat value="1.2M" label="AI Predictions" />
          <Stat value="94%" label="Success Rate" />
          <Stat value="24/7" label="Monitoring" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-black/5 dark:border-white/5 text-center">
        <p className="text-slate-500 text-sm">© 2026 FinVerse AI Ecosystem. Real-time intelligence for the modern era.</p>
      </footer>
    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon, title, desc, delay = "" }) => (
  <div className={`reveal opacity-0 translate-y-8 transition-all duration-700 ${delay} p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all`}>
    <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const StepCard = ({ number, title, text, color }) => (
  <div className={`reveal opacity-0 translate-y-8 transition-all duration-700 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border-l-4 ${color}`}>
    <span className="text-4xl font-black opacity-10 block mb-2">{number}</span>
    <h4 className="text-xl font-bold mb-2">{title}</h4>
    <p className="text-slate-600 dark:text-slate-400 text-sm">{text}</p>
  </div>
);

const Stat = ({ value, label }) => (
  <div className="reveal opacity-0 translate-y-8 transition-all duration-700">
    <div className="text-4xl font-bold text-emerald-400 mb-2">{value}</div>
    <div className="text-slate-400 text-sm uppercase tracking-wider">{label}</div>
  </div>
);

export default FinVerseLanding;