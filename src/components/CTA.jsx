import React, { useState } from 'react';
import { Send, Mail } from 'lucide-react';

export const CTA = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setEmail('');
  };

  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gray-700/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-700/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <span className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 text-sm font-medium inline-block mb-6">
            STAY UPDATED
          </span>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Get 15% Off Your First Order
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Subscribe to our newsletter and receive exclusive deals, new arrivals, and style tips delivered straight to your inbox.
          </p>

          {/* Email Subscription Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 transition"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition duration-300 flex items-center justify-center gap-2 group"
            >
              <Send size={20} className="group-hover:translate-x-1 transition" />
              <span>Subscribe</span>
            </button>
          </form>

          {/* Success Message */}
          {submitted && (
            <div className="mb-8 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 font-medium">
              ✓ Thank you! Check your email for your 15% discount code.
            </div>
          )}

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-gray-300 text-sm pt-8 border-t border-gray-700/50">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔒</span>
              <span>We never spam your inbox</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📧</span>
              <span>Unsubscribe anytime</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span>Exclusive member offers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
