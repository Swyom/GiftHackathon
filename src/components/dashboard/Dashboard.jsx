import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  WalletIcon,
  ChartBarIcon,
  NewspaperIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  BellIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  DocumentTextIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import StockCard from './StockCard';
import MarketSnapshot from './MarketSnapshot';
import PortfolioAnalytics from './PortfolioAnalytics';
import Watchlist from './Watchlist';
import TopStocks from './TopStocks';
import QuickActions from './QuickActions';

function Dashboard(props) {
  const user = props.user;
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [selectedMarket, setSelectedMarket] = useState('NASDAQ');
  
  // Sample data based on the image
  const userStats = {
    name: "Matt",
    balance: 14032.56,
    balanceChange: 5.63,
    currentValue: 203.65,
    nasdaq: 10,
    sse: "5D",
    euronext: "1M",
    bse: "6M"
  };

  const generateSpark = () =>
    Array.from({ length: 7 }, () => ({ value: Math.random() * 10 + 20 }));

  const myStocks = [
    { name: 'NVIDIA', symbol: 'NVDA', change: 5.63, isPositive: true, shares: 10, value: 4500, spark: generateSpark() },
    { name: 'Meta', symbol: 'META', change: -4.44, isPositive: false, shares: 15, value: 3200, spark: generateSpark() },
    { name: 'Tesla Inc', symbol: 'TSLA', change: -1.76, isPositive: false, shares: 8, value: 2800, spark: generateSpark() },
    { name: 'Apple Inc', symbol: 'AAPL', change: 23.41, isPositive: true, shares: 25, value: 4250, spark: generateSpark() },
    { name: 'AMD', symbol: 'AMD', change: 5.63, isPositive: true, shares: 20, value: 3650, spark: generateSpark() }
  ];

  const marketIndices = [
    { name: 'NASDAQ', value: 14250.25, change: 0.8, isPositive: true },
    { name: 'S&P 500', value: 4780.50, change: 0.3, isPositive: true },
    { name: 'DOW', value: 37500.75, change: -0.2, isPositive: false },
    { name: 'RUSSELL', value: 2050.25, change: 0.5, isPositive: true }
  ];

  // sample performance data for line chart
  const performanceData = [
    { date: 'Jan', value: 12000 },
    { date: 'Feb', value: 12500 },
    { date: 'Mar', value: 13000 },
    { date: 'Apr', value: 12800 },
    { date: 'May', value: 14000 },
    { date: 'Jun', value: 14500 }
  ];

  // distribution pie chart derived from myStocks
  const distributionData = myStocks.map((s) => ({ name: s.symbol, value: s.value }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF'];

  const quickNavItems = [
    { name: 'Dashboard', icon: ChartBarIcon, active: true },
    { name: 'Portfolio', icon: WalletIcon },
    { name: 'Trading', icon: ArrowTrendingUpIcon },
    { name: 'Wallet', icon: CreditCardIcon },
    { name: 'Tutorial', icon: BookOpenIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-white font-semibold text-xl">Foxstocks</span>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {quickNavItems.map((item) => (
                <button
                  key={item.name}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                    item.active 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
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
              {props.onLogout && (
                <button
                  onClick={props.onLogout}
                  className="ml-2 px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                >
                  Logout
                </button>
              )}
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-700">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Welcome back,</p>
                  <p className="text-white font-semibold">{user?.name || userStats.name}</p>
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
        <div className="grid grid-cols-12 gap-6">
          {/* Main Content - Left Side (8 columns) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white"
            >
              <h1 className="text-2xl font-bold mb-2">Hello {user?.name || userStats.name},</h1>
              <p className="text-blue-100">Here's your market overview for today</p>
            </motion.div>

            {/* My Stocks Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">My Stocks</h2>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  View All →
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myStocks.map((stock, index) => (
                  <StockCard key={index} stock={stock} />
                ))}
              </div>

              {/* Current Value and Balance */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-700">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Current Value</p>
                  <p className="text-2xl font-bold text-white">${userStats.currentValue}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Balance</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-white">${userStats.balance.toLocaleString()}</p>
                    <span className="text-sm text-green-400">(+{userStats.balanceChange}%)</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Market Indices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Market Indices</h2>
                <div className="flex space-x-2">
                  {['NASDAQ', 'SSE', 'Euronext', 'BSE'].map((market) => (
                    <button
                      key={market}
                      onClick={() => setSelectedMarket(market)}
                      className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                        selectedMarket === market
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {market}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {marketIndices.map((index, i) => (
                  <div key={i} className="p-4 bg-gray-700/30 rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">{index.name}</p>
                    <p className="text-lg font-semibold text-white">{index.value.toLocaleString()}</p>
                    <p className={`text-sm ${index.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {index.isPositive ? '+' : ''}{index.change}%
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Portfolio Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Portfolio Performance</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performanceData}>
                  <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Allocation Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Portfolio Allocation</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Market Snapshot */}
            <MarketSnapshot />
          </div>

          {/* Right Sidebar - (4 columns) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">NASDAQ</span>
                  <span className="text-white font-medium">{userStats.nasdaq}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">SSE</span>
                  <span className="text-white font-medium">{userStats.sse}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Euronext</span>
                  <span className="text-white font-medium">{userStats.euronext}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">BSE</span>
                  <span className="text-white font-medium">{userStats.bse}</span>
                </div>
              </div>
            </motion.div>

            {/* Portfolio Analytics */}
            <PortfolioAnalytics
              performanceData={performanceData}
              distributionData={distributionData}
              COLORS={COLORS}
            />

            {/* Top Stock */}
            <TopStocks />

            {/* Watchlist */}
            <Watchlist />
          </div>
        </div>

        {/* Timeframe Selector (Bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex justify-center space-x-2"
        >
          {['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y'].map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedTimeframe === tf
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tf}
            </button>
          ))}
        </motion.div>
      </main>
    </div>
  );
}

export default Dashboard;