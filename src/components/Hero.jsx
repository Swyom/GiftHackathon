import React from 'react';
import { ArrowRight } from 'lucide-react';
import shoe from '../assets/shoe1.png';

export const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-[#f5f1ed] relative overflow-hidden pt-20 pb-10">
      {/* Background decorative shapes */}
      <div className="absolute top-10 right-20 w-72 h-72 bg-gradient-to-br from-yellow-100 to-orange-50 rounded-full blur-3xl opacity-40 -z-10"></div>
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-gradient-to-tr from-gray-200 to-gray-100 rounded-full blur-3xl opacity-30 -z-10"></div>
      
      {/* Faded typography background */}
      <div className="absolute top-32 right-0 text-gray-200 text-9xl font-bold opacity-10 -z-10 overflow-hidden">
        SNEAKERS
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-block">
              <span className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-full text-gray-700 text-xs font-bold tracking-widest uppercase">
                ✨ New Collection For Sneakers
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Sneakers And Athletic Shoes
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg font-light">
              Discover premium athletic footwear designed for style and comfort. Our collection features handcrafted sneakers that blend modern aesthetics with superior performance.
            </p>

            {/* Shop Now Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 hover:shadow-lg hover:-translate-y-1 transition duration-300 transform flex items-center justify-center gap-2 group">
                Shop Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </button>
              <button className="px-8 py-4 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition duration-300">
                View Collection
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-12 border-t border-gray-300">
              <div>
                <div className="text-3xl font-bold text-gray-900">15K+</div>
                <div className="text-gray-600 text-sm">Premium Designs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">99%</div>
                <div className="text-gray-600 text-sm">Customer Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right - Shoe Image */}
          <div className="relative h-96 md:h-full flex items-center justify-center group">
            {/* Soft shadow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-64 bg-gradient-to-t from-gray-400/15 to-transparent rounded-full blur-3xl"></div>
            </div>
            
            {/* Shoe Image Placeholder - Floating with rotation */}
            <div className="relative z-10 transform group-hover:scale-105 group-hover:rotate-2 transition duration-500 ease-out">
              <img src={shoe} alt="Premium Sneaker" className="w-136 h-190 drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
