import React, { useState } from 'react';
import { Menu, X, Search, User, Heart, ShoppingCart } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#f5f1ed]/95 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Left */}
          <div className="flex-shrink-0 flex items-center">
            <span className="font-bold text-2xl text-gray-900">LIMO</span>
          </div>

          {/* Menu Center - Desktop */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#home" className="text-gray-700 hover:text-gray-900 font-medium text-sm transition duration-300 relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#shop" className="text-gray-700 hover:text-gray-900 font-medium text-sm transition duration-300 relative group">
              Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#products" className="text-gray-700 hover:text-gray-900 font-medium text-sm transition duration-300 relative group">
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#pages" className="text-gray-700 hover:text-gray-900 font-medium text-sm transition duration-300 relative group">
              Pages
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#blog" className="text-gray-700 hover:text-gray-900 font-medium text-sm transition duration-300 relative group">
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contact" className="text-gray-700 hover:text-gray-900 font-medium text-sm transition duration-300 relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          {/* Icons Right - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <button className="p-2 hover:bg-gray-200 rounded-full transition duration-300">
              <Search size={20} className="text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full transition duration-300">
              <User size={20} className="text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full transition duration-300">
              <Heart size={20} className="text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full transition duration-300 relative">
              <ShoppingCart size={20} className="text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition duration-300"
          >
            {isOpen ? <X size={24} className="text-gray-900" /> : <Menu size={24} className="text-gray-900" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
            <a href="#home" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition duration-300">
              Home
            </a>
            <a href="#shop" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition duration-300">
              Shop
            </a>
            <a href="#products" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition duration-300">
              Products
            </a>
            <a href="#pages" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition duration-300">
              Pages
            </a>
            <a href="#blog" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition duration-300">
              Blog
            </a>
            <a href="#contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition duration-300">
              Contact
            </a>
            <div className="flex gap-3 pt-4">
              <button className="flex-1 p-2 hover:bg-gray-200 rounded-full transition duration-300">
                <Search size={20} className="text-gray-700 mx-auto" />
              </button>
              <button className="flex-1 p-2 hover:bg-gray-200 rounded-full transition duration-300">
                <User size={20} className="text-gray-700 mx-auto" />
              </button>
              <button className="flex-1 p-2 hover:bg-gray-200 rounded-full transition duration-300">
                <Heart size={20} className="text-gray-700 mx-auto" />
              </button>
              <button className="flex-1 p-2 hover:bg-gray-200 rounded-full transition duration-300 relative">
                <ShoppingCart size={20} className="text-gray-700 mx-auto" />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
