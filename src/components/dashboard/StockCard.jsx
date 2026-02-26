import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  StarIcon as StarOutline,
  ChartBarIcon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  BellIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { AreaChart, Area, LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

// Generate realistic sparkline data
const generateSparklineData = (points = 20, trend = 'random') => {
  const data = [];
  let value = 100;
  const now = Date.now();
  
  for (let i = 0; i < points; i++) {
    // Simulate realistic market movements
    let change = 0;
    switch(trend) {
      case 'up':
        change = (Math.random() * 4) - 1; // Mostly positive
        break;
      case 'down':
        change = (Math.random() * 4) - 3; // Mostly negative
        break;
      default:
        change = (Math.random() * 6) - 3; // Random
    }
    
    value = value * (1 + change / 100);
    
    data.push({
      time: new Date(now - (points - i) * 3600000).toLocaleTimeString(),
      value: Number(value.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000)
    });
  }
  
  return data;
};

// Live price updates
const useLivePrice = (initialPrice, volatility = 0.02) => {
  const [price, setPrice] = useState(initialPrice);
  const [change, setChange] = useState(0);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const priceChange = (Math.random() - 0.5) * price * volatility;
      const newPrice = price + priceChange;
      const percentChange = (priceChange / price) * 100;
      
      setPrice(newPrice);
      setChange(percentChange);
      
      // Update trend data
      setTrend(prev => {
        const newTrend = [...prev, { value: newPrice }];
        if (newTrend.length > 20) newTrend.shift();
        return newTrend;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [price, volatility]);

  return { price, change, trend };
};

function StockCard({ stock: initialStock }) {
  const [stock, setStock] = useState(initialStock);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [sparklineData, setSparklineData] = useState(
    initialStock.spark || generateSparklineData(20, initialStock.isPositive ? 'up' : 'down')
  );
  const [priceData, setPriceData] = useState({
    current: initialStock.value || 100,
    change: initialStock.change || 0,
    high: initialStock.value ? initialStock.value * 1.05 : 105,
    low: initialStock.value ? initialStock.value * 0.95 : 95
  });

  // Live price updates
  const { price: livePrice, change: liveChange, trend } = useLivePrice(
    initialStock.value || 100,
    initialStock.volatility || 0.02
  );

  // Update stock data with live prices
  useEffect(() => {
    setStock(prev => ({
      ...prev,
      value: livePrice,
      change: liveChange.toFixed(2),
      isPositive: liveChange >= 0
    }));
  }, [livePrice, liveChange]);

  // Update sparkline with live data
  useEffect(() => {
    if (trend.length > 0) {
      setSparklineData(trend);
    }
  }, [trend]);

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(2);
  };

  // Get gradient colors based on performance
  const getGradientColors = () => {
    if (stock.isPositive) {
      return {
        from: '#4ade80',
        to: '#22c55e',
        bg: 'from-green-500/20 to-emerald-500/20',
        border: 'border-green-500/30',
        text: 'text-green-400'
      };
    } else {
      return {
        from: '#f87171',
        to: '#ef4444',
        bg: 'from-red-500/20 to-rose-500/20',
        border: 'border-red-500/30',
        text: 'text-red-400'
      };
    }
  };

  const colors = getGradientColors();

  // Custom tooltip for sparkline
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/95 backdrop-blur-xl border border-gray-700 rounded-lg p-2 shadow-xl"
        >
          <p className="text-white text-xs font-semibold">${payload[0].value.toFixed(2)}</p>
          <p className="text-gray-400 text-xs">{label}</p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.03,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-300 cursor-pointer
        ${colors.bg} ${colors.border}
        hover:shadow-2xl hover:shadow-${stock.isPositive ? 'green' : 'red'}-500/20
      `}
      style={{
        background: `linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(17, 24, 39, 0.6) 100%)`
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          background: `radial-gradient(circle at ${isHovered ? '50%' : '0%'} 50%, ${colors.from}15 0%, transparent 50%)`
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Glowing effect on hover */}
      <motion.div
        className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, ${colors.from}40, ${colors.to}40)`
        }}
      />

      <div className="relative p-5">
        {/* Header with actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* Company logo placeholder */}
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
              <span className="text-lg font-bold text-white">
                {stock.symbol?.charAt(0) || 'S'}
              </span>
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-white font-semibold text-lg tracking-tight">
                  {stock.name}
                </h3>
                <span className="text-xs font-medium px-2 py-0.5 bg-gray-700/50 rounded-full text-gray-300">
                  {stock.symbol}
                </span>
              </div>
              
              {/* Live indicator */}
              <div className="flex items-center space-x-2 mt-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
                <span className="text-xs text-gray-400">Live</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <AnimatePresence mode="wait">
                {isFavorite ? (
                  <motion.div
                    key="solid"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <StarSolid className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="outline"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <StarOutline className="w-4 h-4 text-gray-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <BellIcon className="w-4 h-4 text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Price and change */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Current Price</p>
            <div className="flex items-baseline space-x-2">
              <motion.span
                key={livePrice}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-white tracking-tight"
              >
                ${livePrice.toFixed(2)}
              </motion.span>
              <motion.span
                key={liveChange}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                  stock.isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}
              >
                {stock.isPositive ? '+' : ''}{liveChange.toFixed(2)}%
              </motion.span>
            </div>
          </div>
          
          {/* Shares info */}
          {stock.shares && (
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Holdings</p>
              <p className="text-white font-semibold">{stock.shares} shares</p>
              <p className="text-xs text-gray-400">
                ${(stock.shares * livePrice).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Sparkline chart */}
        <motion.div 
          className="h-16 mt-2"
          animate={{ opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={`gradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.from} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors.from} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={colors.from}
                strokeWidth={2}
                fill={`url(#gradient-${stock.symbol})`}
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stats grid (expandable) */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-700/50"
            >
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Day High</p>
                  <p className="text-white font-medium">${priceData.high.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Day Low</p>
                  <p className="text-white font-medium">${priceData.low.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Volume</p>
                  <p className="text-white font-medium">{formatNumber(Math.random() * 10000000)}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer with additional info */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">
              Volatility: {(stock.volatility || 2).toFixed(1)}%
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <InformationCircleIcon className="w-4 h-4" />
              <span>{showDetails ? 'Less' : 'More'}</span>
            </motion.button>
            
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <SparklesIcon className="w-4 h-4 text-yellow-400" />
            </motion.div>
          </div>
        </div>

        {/* AI Prediction Badge (optional) */}
        {stock.aiPrediction && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-2 right-2"
          >
            <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
              stock.aiPrediction === 'UP' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              AI: {stock.aiPrediction}
            </div>
          </motion.div>
        )}
      </div>

      {/* Animated pulse ring on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          boxShadow: isHovered 
            ? [`0 0 0 0 ${colors.from}`, `0 0 0 4px ${colors.from}20`]
            : `0 0 0 0 transparent`
        }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.div>
  );
}

// Example usage with sample data
export const sampleStocks = [
  {
    name: 'NVIDIA',
    symbol: 'NVDA',
    shares: 10,
    value: 4500,
    change: 5.63,
    isPositive: true,
    volatility: 3.2,
    aiPrediction: 'UP',
    spark: generateSparklineData(20, 'up')
  },
  {
    name: 'Meta',
    symbol: 'META',
    shares: 15,
    value: 3200,
    change: -4.44,
    isPositive: false,
    volatility: 2.8,
    aiPrediction: 'DOWN',
    spark: generateSparklineData(20, 'down')
  },
  {
    name: 'Tesla Inc',
    symbol: 'TSLA',
    shares: 8,
    value: 2800,
    change: -1.76,
    isPositive: false,
    volatility: 4.5,
    spark: generateSparklineData(20, 'random')
  },
  {
    name: 'Apple Inc',
    symbol: 'AAPL',
    shares: 25,
    value: 4250,
    change: 23.41,
    isPositive: true,
    volatility: 1.8,
    spark: generateSparklineData(20, 'up')
  },
  {
    name: 'AMD',
    symbol: 'AMD',
    shares: 20,
    value: 3650,
    change: 5.63,
    isPositive: true,
    volatility: 2.5,
    spark: generateSparklineData(20, 'up')
  }
];

export default StockCard;