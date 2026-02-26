import { useState } from "react";

export default function Auth({ onBack, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // in a real app you'd validate and authenticate here
    const dummyUser = { name: "User" };
    if (onLoginSuccess) onLoginSuccess(dummyUser);
  };

  return (
    <div className="min-h-screen flex">
      
      {/* LEFT SIDE (IMAGE) */}
      <div className="hidden md:flex w-1/2 bg-blue-600 items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="side"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md">

          <div className="flex justify-between items-center mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="text-sm text-blue-600 hover:underline"
            >
              &larr; Back
            </button>
          )}
          <h2 className="text-2xl font-bold text-center flex-1">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
        </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {isSignUp && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {isSignUp && (
              <input
                type="date"
                placeholder="Date of Birth"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}

            <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          {/* TOGGLE */}
          <p className="text-center mt-4 text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <span
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 cursor-pointer ml-1 font-semibold"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}