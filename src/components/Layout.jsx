import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  UserCircleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import {
  ArrowTrendingUpIcon,
  WalletIcon,
  ChartBarIcon,
  CreditCardIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

function Layout({ user, onLogout }) {
  const quickNavItems = [
    { name: 'Dashboard', icon: ChartBarIcon, path: '/dashboard' },
    { name: 'Portfolio', icon: WalletIcon, path: '/portfolio' },
    { name: 'Trading', icon: ArrowTrendingUpIcon, path: '/trading' },
    { name: 'News', icon: CreditCardIcon, path: '/news' },
    { name: 'Tutorial', icon: BookOpenIcon, path: '/tutorial' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-white font-semibold text-xl">FinVerse</span>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {quickNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 relative">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="ml-2 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                >
                  Logout
                </button>
              )}
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-700">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Welcome back,</p>
                  <p className="text-white font-semibold">{user?.name}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <UserCircleIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
