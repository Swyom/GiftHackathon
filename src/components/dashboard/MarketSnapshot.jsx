import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Bar
} from 'recharts';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ClockIcon,
  CalendarIcon,
  InformationCircleIcon,
  ChartBarIcon,
  CursorArrowRaysIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

// Generate real-time simulated data
const generateLiveData = () => {
  const data = [];
  const now = new Date();
  let baseValue = 12000 + Math.random() * 500;
  
  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000); //每分钟数据点
    const volatility = Math.sin(i / 5) * 50 + Math.random() * 30;
    const value = baseValue + volatility;
    
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: Number(value.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 500000,
      timestamp: time
    });
    
    baseValue += (Math.random() - 0.5) * 20;
  }
  
  return data;
};

// Generate market depth data
const generateMarketDepth = () => {
  const bids = [];
  const asks = [];
  const basePrice = 12000;
  
  for (let i = 0; i < 10; i++) {
    bids.push({
      price: basePrice - (i + 1) * 10,
      volume: Math.floor(Math.random() * 1000) + 500
    });
    asks.push({
      price: basePrice + (i + 1) * 10,
      volume: Math.floor(Math.random() * 1000) + 500
    });
  }
  
  return { bids, asks };
};

function MarketSnapshot() {
  const [liveData, setLiveData] = useState(generateLiveData());
  const [marketDepth, setMarketDepth] = useState(generateMarketDepth());
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [chartType, setChartType] = useState('area');
  const [isLive, setIsLive] = useState(true);
  const [showVolume, setShowVolume] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(null);

  // Real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setLiveData(prevData => {
        const newData = [...prevData];
        const lastValue = newData[newData.length - 1].value;
        const newValue = lastValue + (Math.random() - 0.5) * 15;
        const newTime = new Date();
        
        // Add new data point and remove oldest
        newData.push({
          time: newTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          value: Number(newValue.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000) + 500000,
          timestamp: newTime
        });
        
        return newData.slice(-31);
      });
      
      // Update market depth
      setMarketDepth(generateMarketDepth());
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Calculate statistics
  const currentValue = liveData[liveData.length - 1]?.value || 12000;
  const prevValue = liveData[liveData.length - 2]?.value || currentValue;
  const change = currentValue - prevValue;
  const changePercent = (change / prevValue * 100).toFixed(2);
  const isPositive = change >= 0;
  
  const high24h = Math.max(...liveData.map(d => d.value));
  const low24h = Math.min(...liveData.map(d => d.value));
  const volume24h = liveData.reduce((sum, d) => sum + d.volume, 0);
  const avgValue = liveData.reduce((sum, d) => sum + d.value, 0) / liveData.length;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/95 backdrop-blur-xl border border-gray-700 rounded-xl p-4 shadow-2xl"
        >
          <p className="text-gray-400 text-xs mb-2">{label}</p>
          <p className="text-white font-semibold text-lg">
            ${payload[0].value.toLocaleString()}
          </p>
          {payload[1] && (
            <p className="text-sm text-gray-400">
              Volume: {payload[1].value.toLocaleString()}
            </p>
          )}
          <div className="mt-2 pt-2 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // Market depth chart
  const MarketDepthChart = () => (
    <div className="h-32 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={[...marketDepth.bids, ...marketDepth.asks]}>
          <Bar dataKey="volume" fill="#3b82f6" opacity={0.3} />
          <ReferenceLine x={12000} stroke="#ef4444" strokeDasharray="3 3" />
          <XAxis dataKey="price" hide />
          <YAxis hide />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-gray-800/50 via-gray-800/40 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 shadow-2xl"
    >
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
            <ChartBarIcon className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Market Snapshot</h2>
            <p className="text-sm text-gray-500">Real-time market intelligence</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Live indicator */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
              isLive 
                ? 'bg-gradient-to-r from-green-500/30 to-green-500/10 text-green-300 border border-green-500/50 hover:border-green-400' 
                : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:bg-gray-700'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-sm">{isLive ? 'LIVE' : 'PAUSED'}</span>
          </motion.button>

          {/* Timeframe selector */}
          <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
            {['1H', '4H', '1D', '1W'].map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedTimeframe === tf
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart type selector */}
          <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
            <button
              onClick={() => setChartType('area')}
              className={`p-2 rounded-md transition-all duration-200 ${
                chartType === 'area' ? 'bg-blue-500/30 text-blue-300' : 'text-gray-400 hover:text-gray-300'
              }`}
              title="Area Chart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-2 rounded-md transition-all duration-200 ${
                chartType === 'line' ? 'bg-blue-500/30 text-blue-300' : 'text-gray-400 hover:text-gray-300'
              }`}
              title="Line Chart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12H4V4z" />
              </svg>
            </button>
          </div>

          {/* Volume toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowVolume(!showVolume)}
            className={`p-2 rounded-lg transition-all duration-200 border ${
              showVolume ? 'bg-blue-500/30 text-blue-300 border-blue-500/50' : 'bg-gray-800/50 text-gray-400 border-gray-700/50 hover:border-gray-600'
            }`}
            title="Toggle Volume"
          >
            <EyeIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Main price display */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1 space-y-4">
          {/* Current price */}
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-800/30 rounded-xl p-4 border border-gray-600/50 hover:border-gray-500/50 transition-colors">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Current Price</p>
            <div className="flex items-end space-x-2">
              <span className="text-3xl font-bold text-white">
                ${currentValue.toLocaleString()}
              </span>
              <motion.span
                key={change}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-lg font-semibold mb-1 ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent}%)
              </motion.span>
            </div>
          </div>

          {/* Key stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-3 border border-green-500/30">
              <p className="text-xs text-green-400 uppercase tracking-wide">24h High</p>
              <p className="text-lg font-bold text-green-300">${high24h.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-xl p-3 border border-red-500/30">
              <p className="text-xs text-red-400 uppercase tracking-wide">24h Low</p>
              <p className="text-lg font-bold text-red-300">${low24h.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-3 border border-blue-500/30">
              <p className="text-xs text-blue-400 uppercase tracking-wide">Volume</p>
              <p className="text-lg font-bold text-blue-300">{(volume24h / 1000000).toFixed(2)}M</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 rounded-xl p-3 border border-cyan-500/30">
              <p className="text-xs text-cyan-400 uppercase tracking-wide">Avg</p>
              <p className="text-lg font-bold text-cyan-300">${avgValue.toFixed(0)}</p>
            </div>
          </div>

          {/* Market depth preview */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/20 rounded-xl p-3 border border-gray-700/50">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">Market Depth</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-green-400">Bids: {marketDepth.bids.reduce((sum, b) => sum + b.volume, 0).toLocaleString()}</span>
                <span className="text-red-400">Asks: {marketDepth.asks.reduce((sum, a) => sum + a.volume, 0).toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-gray-600 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }}
                  className="h-full bg-green-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main chart */}
        <div className="lg:col-span-3">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart 
                  data={liveData}
                  onMouseMove={(e) => setCursorPosition(e.activeTooltipIndex)}
                  onMouseLeave={() => setCursorPosition(null)}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#6b7280"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fill="url(#colorValue)"
                    animationDuration={300}
                    dot={cursorPosition !== null}
                    activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff' }}
                  />
                  {showVolume && (
                    <Bar dataKey="volume" fill="#6b7280" opacity={0.3} yAxisId="volume" />
                  )}
                  <ReferenceLine 
                    y={avgValue} 
                    stroke="#9ca3af" 
                    strokeDasharray="3 3" 
                    label={{ value: 'AVG', fill: '#9ca3af', fontSize: 10 }}
                  />
                </AreaChart>
              ) : (
                <LineChart data={liveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#6b7280"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickFormatter={(value) => `$${value.toFixed(0)}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                    animationDuration={300}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Volume bars */}
          {showVolume && (
            <div className="h-16 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={liveData}>
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#6b7280" 
                    fill="#6b7280" 
                    opacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700/50">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-800/20 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors"
        >
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">Open</p>
          <p className="text-xl font-bold text-white">${liveData[0]?.value.toLocaleString()}</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-800/20 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors"
        >
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">Previous Close</p>
          <p className="text-xl font-bold text-white">${prevValue.toLocaleString()}</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-800/20 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors"
        >
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1.5">Day Range</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-red-400">${low24h.toFixed(0)}</span>
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(currentValue - low24h) / (high24h - low24h) * 100}%` }}
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
              />
            </div>
            <span className="text-xs font-medium text-green-400">${high24h.toFixed(0)}</span>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-800/20 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-colors"
        >
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Trade Info</p>
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-gray-300">
              <ClockIcon className="w-4 h-4 mr-1 text-gray-400" />
              <span className="text-sm">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
              <span className="text-sm">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Real-time stats ticker */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-4 flex items-center justify-between p-3 bg-blue-500/10 rounded-xl border border-blue-500/20"
      >
        <div className="flex items-center space-x-4">
          <InformationCircleIcon className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-blue-400">
            Real-time data updating every 3 seconds • {liveData.length} data points
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <CursorArrowRaysIcon className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400">
            Hover for details
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default MarketSnapshot;