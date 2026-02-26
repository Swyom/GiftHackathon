import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { Mail, Lock, User, Phone, Calendar, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function Auth({ onBack, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const pollingIntervalRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    confirmPassword: ""
  });

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // NEW: A failsafe to prevent the phone from hanging infinitely
  const fetchWithTimeout = async (promise, ms = 10000) => {
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out. Please open this link in standard Safari or Chrome, not an in-app browser.")), ms)
    );
    return Promise.race([promise, timeout]);
  };

  const startVerificationPolling = (email, password) => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const { data } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (data?.user) {
          clearInterval(pollingIntervalRef.current);
          setLoading(false);
          onLoginSuccess(); 
        }
      } catch (err) {
        // Silently catch polling errors (waiting for email verify)
      }
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (formData.password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        // Added the timeout failsafe here
        const { data: authData, error: authError } = await fetchWithTimeout(
          supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                full_name: formData.fullName,
                phone: formData.phone
              }
            }
          })
        );

        if (authError) throw authError;

        if (authData.user) {
          supabase.from('users').insert([{
            id: authData.user.id,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            date_of_birth: formData.dob
          }]).then(({error}) => {
            if (error) console.error("Profile insert failed:", error);
          });

          setSuccess("Registration successful! Open the email on your phone to verify. This page will automatically log you in once confirmed.");
          startVerificationPolling(formData.email, formData.password);
          setLoading(false); 
        }
      } else {
        // --- SIGN IN FLOW ---
        // Added the timeout failsafe here
        const { data, error: signInError } = await fetchWithTimeout(
          supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          })
        );

        if (signInError) throw signInError;

        if (data.user) {
          setLoading(false);
          onLoginSuccess(); 
        }
      }
    } catch (err) {
      // If it fails or times out, it will cleanly turn off the loading spinner and show the error!
      setError(err.message);
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* LEFT SIDE - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/30 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/30 blur-[100px] rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold">F</span>
              </div>
              <span className="text-3xl font-bold">FinVerse <span className="text-emerald-300">AI</span></span>
            </div>
            
            <h1 className="text-4xl font-bold mb-6">
              {isSignUp ? 'Join the Future of Finance' : 'Welcome Back to FinVerse'}
            </h1>
            
            <p className="text-xl text-white/80 mb-8">
              {isSignUp 
                ? 'Create your account and start your journey with AI-powered financial intelligence.'
                : 'Access your personalized dashboard with real-time market insights.'}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden flex items-center text-gray-400 hover:text-white mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          )}

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-400">
                {isSignUp ? 'Sign up to start your financial journey' : 'Sign in to continue'}
              </p>
            </div>

            {/* ERROR MESSAGE DISPLAY */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-between">
                <p className="text-emerald-400 text-sm">{success}</p>
                <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin ml-4 flex-shrink-0"></div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {isSignUp && (
                <>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading || success} 
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : (success ? 'Waiting for phone verification...' : (isSignUp ? 'Create Account' : 'Sign In'))}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError(null);
                    setSuccess(null);
                    setLoading(false);
                    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                  }}
                  className="ml-2 text-blue-400 hover:text-blue-300 font-semibold"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>

            {onBack && (
              <div className="mt-6 text-center hidden lg:block">
                <button
                  onClick={onBack}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  ← Back to Home
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}