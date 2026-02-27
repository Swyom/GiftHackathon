import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StarIcon as StarOutline,
  ChartBarIcon,
  InformationCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const generateSparklineData = (points = 20, isPositive) => {
  const data = [];
  let value = 100;
  for (let i = 0; i < points; i++) {
    let change = isPositive ? (Math.random() * 4) - 1 : (Math.random() * 4) - 3;
    value = value * (1 + change / 100);
    data.push({ value: Number(value.toFixed(2)) });
  }
  return data;
};

export default function StockCard({ stock, onClick }) { 
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Data mapping from the Dashboard
  const currentPrice = stock.value || 0;
  const currentChange = stock.change || 0;
  const isPositive = stock.isPositive;

  const [sparklineData] = useState(generateSparklineData(20, isPositive));

  const colors = isPositive 
    ? { from: '#4ade80', to: '#22c55e', bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', text: 'text-green-400' }
    : { from: '#f87171', to: '#ef4444', bg: 'from-red-500/20 to-rose-500/20', border: 'border-red-500/30', text: 'text-red-400' };

  const formatINR = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);
  const cleanSymbol = stock.symbol.replace('.NS', '');

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-800/95 backdrop-blur-xl border border-gray-700 rounded-lg p-2 shadow-xl">
          <p className="text-white text-xs font-semibold">Live Trend</p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      onClick={onClick} // <-- TRIGGERS NAVIGATION
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-300 cursor-pointer ${colors.bg} ${colors.border} hover:shadow-2xl hover:shadow-${isPositive ? 'green' : 'red'}-500/20`}
      style={{ background: `linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(17, 24, 39, 0.6) 100%)` }}
    >
      <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" animate={{ background: `radial-gradient(circle at ${isHovered ? '50%' : '0%'} 50%, ${colors.from}15 0%, transparent 50%)` }} />
      <motion.div className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" style={{ background: `linear-gradient(90deg, ${colors.from}40, ${colors.to}40)` }} />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
              <span className="text-lg font-bold text-white">{cleanSymbol.charAt(0)}</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-semibold text-lg tracking-tight">{stock.name}</h3>
                <span className="text-xs font-medium px-2 py-0.5 bg-gray-700/50 rounded-full text-gray-300">{cleanSymbol}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-gray-400">Live NSE/BSE</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }} 
              onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }} // STOPS NAV
              className="p-2 hover:bg-white/5 rounded-lg z-10 relative"
            >
              {isFavorite ? <StarSolid className="w-4 h-4 text-yellow-400" /> : <StarOutline className="w-4 h-4 text-gray-400" />}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }} 
              onClick={(e) => e.stopPropagation()} 
              className="p-2 hover:bg-white/5 rounded-lg z-10 relative"
            >
              <BellIcon className="w-4 h-4 text-gray-400" />
            </motion.button>
          </div>
        </div>

        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Current Price</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-white tracking-tight">
                {formatINR(currentPrice)}
              </span>
              <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {isPositive ? '+' : ''}{currentChange.toFixed(2)}%
              </span>
            </div>
          </div>
          {stock.shares && (
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Holdings</p>
              <p className="text-white font-semibold">{stock.shares} shares</p>
              <p className="text-xs text-gray-400">{formatINR(stock.shares * currentPrice)}</p>
            </div>
          )}
        </div>

        <motion.div className="h-16 mt-2" animate={{ opacity: isHovered ? 1 : 0.7 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`gradient-${cleanSymbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.from} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors.from} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke={colors.from} strokeWidth={2} fill={`url(#gradient-${cleanSymbol})`} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <AnimatePresence>
          {showDetails && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-gray-700/50">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-gray-400">Day High</p><p className="text-white font-medium">{stock.high ? formatINR(stock.high) : '...'}</p></div>
                <div><p className="text-xs text-gray-400">Day Low</p><p className="text-white font-medium">{stock.low ? formatINR(stock.low) : '...'}</p></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">Yahoo Finance Data</span>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }} 
              onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }} // STOPS NAV
              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white z-10 relative"
            >
              <InformationCircleIcon className="w-4 h-4" />
              <span>{showDetails ? 'Less' : 'More'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      <motion.div className="absolute inset-0 rounded-2xl" animate={{ boxShadow: isHovered ? [`0 0 0 0 ${colors.from}`, `0 0 0 4px ${colors.from}20`] : `0 0 0 0 transparent` }} transition={{ duration: 1, repeat: Infinity }} />
    </motion.div>
  );
}