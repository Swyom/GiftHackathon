import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LightBulbIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  BanknotesIcon,
  PresentationChartLineIcon,
  InformationCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  ReferenceLine
} from 'recharts';

// Professional color palette
const PROFESSIONAL_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#6366f1'  // Indigo
];

// Risk level colors
const RISK_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444'
};

// Generate realistic performance data
const generatePerformanceData = (days = 30) => {
  const data = [];
  let value = 100000;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Simulate realistic market movements
    const dailyChange = (Math.random() - 0.5) * 0.03; // -3% to +3%
    value = value * (1 + dailyChange);
    
    // Add some trend
    if (i > days * 0.7) value *= 1.005; // Upward trend
    else if (i > days * 0.3) value *= 0.998; // Slight correction
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Number(value.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 500000,
      timestamp: date.getTime()
    });
  }
  
  return data;
};

// Generate portfolio distribution
const generateDistribution = () => [
  { name: 'Technology', value: 35000, growth: 15.5, risk: 'medium' },
  { name: 'Healthcare', value: 25000, growth: 8.2, risk: 'low' },
  { name: 'Finance', value: 20000, growth: 12.3, risk: 'medium' },
  { name: 'Energy', value: 15000, growth: -2.5, risk: 'high' },
  { name: 'Consumer', value: 12000, growth: 6.8, risk: 'low' },
  { name: 'Real Estate', value: 8000, growth: 4.2, risk: 'low' }
];

// Generate monthly returns
const generateMonthlyReturns = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    return: (Math.random() * 10 - 2).toFixed(1),
    benchmark: (Math.random() * 8 - 1).toFixed(1)
  }));
};

// Generate risk metrics
const generateRiskMetrics = () => ({
  sharpeRatio: (Math.random() * 2 + 0.5).toFixed(2),
  beta: (Math.random() * 0.5 + 0.8).toFixed(2),
  alpha: (Math.random() * 5 - 2).toFixed(2),
  volatility: (Math.random() * 15 + 10).toFixed(1),
  var: (Math.random() * 5 + 2).toFixed(1),
  maxDrawdown: (Math.random() * 15 + 10).toFixed(1)
});

// Generate asset allocation
const generateAssetAllocation = () => [
  { name: 'Stocks', value: 65, color: '#3b82f6' },
  { name: 'Bonds', value: 20, color: '#10b981' },
  { name: 'Real Estate', value: 8, color: '#8b5cf6' },
  { name: 'Cash', value: 5, color: '#f59e0b' },
  { name: 'Commodities', value: 2, color: '#ef4444' }
];

function PortfolioAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [performanceData, setPerformanceData] = useState(generatePerformanceData());
  const [distribution, setDistribution] = useState(generateDistribution());
  const [monthlyReturns, setMonthlyReturns] = useState(generateMonthlyReturns());
  const [riskMetrics, setRiskMetrics] = useState(generateRiskMetrics());
  const [assetAllocation, setAssetAllocation] = useState(generateAssetAllocation());
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [chartType, setChartType] = useState('area');
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredSector, setHoveredSector] = useState(null);
  const [isLive, setIsLive] = useState(true);

  // Live data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setPerformanceData(prev => {
        const newData = [...prev];
        const lastValue = newData[newData.length - 1].value;
        const change = (Math.random() - 0.5) * 500;
        newData.push({
          ...newData[newData.length - 1],
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: lastValue + change,
          timestamp: Date.now()
        });
        return newData.slice(-30);
      });

      // Update distribution with small random changes
      setDistribution(prev => 
        prev.map(item => ({
          ...item,
          value: item.value * (1 + (Math.random() - 0.5) * 0.02),
          growth: item.growth + (Math.random() - 0.5) * 0.5
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Calculate portfolio statistics
  const totalValue = distribution.reduce((sum, item) => sum + item.value, 0);
  const totalGrowth = distribution.reduce((sum, item) => sum + (item.value * item.growth / 100), 0);
  const averageGrowth = totalGrowth / totalValue * 100;
  const isPositive = averageGrowth >= 0;
  
  const bestPerformer = distribution.reduce((best, item) => 
    item.growth > (best?.growth || -Infinity) ? item : best
  , null);
  
  const worstPerformer = distribution.reduce((worst, item) => 
    item.growth < (worst?.growth || Infinity) ? item : worst
  , null);

  // Risk assessment
  const riskScore = distribution.reduce((score, item) => {
    const riskWeight = { low: 1, medium: 2, high: 3 }[item.risk] || 1;
    return score + (item.value / totalValue) * riskWeight;
  }, 0);
  
  const riskLevel = riskScore < 1.5 ? 'low' : riskScore < 2.2 ? 'medium' : 'high';

  // Custom tooltip for charts
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
              Change: {payload[1].value > 0 ? '+' : ''}{payload[1].value}%
            </p>
          )}
        </motion.div>
      );
    }
    return null;
  };

  // Render overview tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Performance Chart */}
      <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-300">Portfolio Performance</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded-lg transition-colors ${
                chartType === 'area' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400'
              }`}
            >
              <PresentationChartLineIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded-lg transition-colors ${
                chartType === 'line' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400'
              }`}
            >
              <ChartPieIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#9ca3af', fontSize: 10 }}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#performanceGradient)"
                />
              </AreaChart>
            ) : (
              <LineChart data={performanceData}>
                <XAxis dataKey="date" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Timeframe selector */}
        <div className="flex justify-center mt-4 space-x-2">
          {['1W', '1M', '3M', '6M', '1Y'].map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-700/30 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Total Value</p>
          <p className="text-lg font-bold text-white">${totalValue.toLocaleString()}</p>
          <p className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{averageGrowth.toFixed(2)}% overall
          </p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Risk Level</p>
          <div className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: RISK_COLORS[riskLevel] }}
            />
            <p className="text-sm font-medium text-white capitalize">{riskLevel}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1">Score: {riskScore.toFixed(2)}</p>
        </div>
      </div>

      {/* Best/Worst Performers */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-green-500/10 rounded-xl p-3 border border-green-500/20"
        >
          <p className="text-xs text-gray-400 mb-1">Best Performer</p>
          <p className="text-sm font-semibold text-white">{bestPerformer?.name}</p>
          <p className="text-sm font-bold text-green-400">+{bestPerformer?.growth.toFixed(1)}%</p>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-red-500/10 rounded-xl p-3 border border-red-500/20"
        >
          <p className="text-xs text-gray-400 mb-1">Worst Performer</p>
          <p className="text-sm font-semibold text-white">{worstPerformer?.name}</p>
          <p className="text-sm font-bold text-red-400">{worstPerformer?.growth.toFixed(1)}%</p>
        </motion.div>
      </div>
    </div>
  );

  // Render allocation tab
  const renderAllocation = () => (
    <div className="space-y-6">
      {/* Asset Allocation Pie Chart */}
      <div className="bg-gray-700/30 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Asset Allocation</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assetAllocation}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
                onMouseEnter={(_, index) => setHoveredSector(index)}
                onMouseLeave={() => setHoveredSector(null)}
              >
                {assetAllocation.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    opacity={hoveredSector === null || hoveredSector === index ? 1 : 0.3}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {assetAllocation.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-300">{item.name}</span>
              <span className="text-xs font-medium text-white ml-auto">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Distribution */}
      <div className="bg-gray-700/30 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Sector Distribution</h3>
        <div className="space-y-3">
          {distribution.map((item, index) => {
            const percent = (item.value / totalValue * 100).toFixed(1);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300">{item.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      item.risk === 'low' ? 'bg-green-500/20 text-green-400' :
                      item.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {item.risk}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-white">{percent}%</span>
                    <span className={`text-xs ${item.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.growth >= 0 ? '+' : ''}{item.growth.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${PROFESSIONAL_COLORS[index % PROFESSIONAL_COLORS.length]} 0%, ${PROFESSIONAL_COLORS[(index + 1) % PROFESSIONAL_COLORS.length]} 100%)`
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Render risk tab
  const renderRisk = () => (
    <div className="space-y-6">
      {/* Risk Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-700/30 rounded-xl p-3">
          <p className="text-xs text-gray-400">Sharpe Ratio</p>
          <p className="text-lg font-bold text-white">{riskMetrics.sharpeRatio}</p>
          <p className="text-xs text-gray-400">Risk-adjusted return</p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-3">
          <p className="text-xs text-gray-400">Beta</p>
          <p className="text-lg font-bold text-white">{riskMetrics.beta}</p>
          <p className="text-xs text-gray-400">Market correlation</p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-3">
          <p className="text-xs text-gray-400">Alpha</p>
          <p className={`text-lg font-bold ${riskMetrics.alpha >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {riskMetrics.alpha}%
          </p>
          <p className="text-xs text-gray-400">Excess return</p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-3">
          <p className="text-xs text-gray-400">Volatility</p>
          <p className="text-lg font-bold text-white">{riskMetrics.volatility}%</p>
          <p className="text-xs text-gray-400">Annualized</p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-3">
          <p className="text-xs text-gray-400">VaR (95%)</p>
          <p className="text-lg font-bold text-red-400">{riskMetrics.var}%</p>
          <p className="text-xs text-gray-400">Value at Risk</p>
        </div>
        <div className="bg-gray-700/30 rounded-xl p-3">
          <p className="text-xs text-gray-400">Max Drawdown</p>
          <p className="text-lg font-bold text-red-400">{riskMetrics.maxDrawdown}%</p>
          <p className="text-xs text-gray-400">Peak to trough</p>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="bg-gray-700/30 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Risk Assessment</h3>
        <div className="relative pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-400">Conservative</span>
            <span className="text-xs text-gray-400">Aggressive</span>
          </div>
          <div className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full">
            <motion.div
              initial={{ left: 0 }}
              animate={{ left: `${(riskScore - 1) * 50}%` }}
              className="absolute w-4 h-4 bg-white rounded-full border-2 border-blue-500 -mt-1"
              style={{ left: `${(riskScore - 1) * 50}%` }}
            />
          </div>
          <p className="text-center mt-4 text-sm text-gray-300">
            Your portfolio has a <span className="font-bold capitalize text-white">{riskLevel}</span> risk profile
          </p>
        </div>
      </div>

      {/* Monthly Returns Comparison */}
      <div className="bg-gray-700/30 rounded-xl p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-4">Monthly Returns vs Benchmark</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyReturns.slice(-6)}>
              <Bar dataKey="return" fill="#3b82f6" opacity={0.7} />
              <Line type="monotone" dataKey="benchmark" stroke="#10b981" strokeWidth={2} />
              <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <Tooltip />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // Render insights tab
  const renderInsights = () => (
    <div className="space-y-4">
      {/* Investment Quote */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
        <div className="flex items-start space-x-3">
          <LightBulbIcon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white text-sm italic">
              "The stock market is filled with individuals who know the price of everything, but the value of nothing."
            </p>
            <p className="text-xs text-gray-400 mt-2">— Philip Fisher</p>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-300">AI-Generated Insights</h3>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/20"
        >
          <div className="flex items-center space-x-2 mb-2">
            <SparklesIcon className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">Diversification Score</span>
          </div>
          <p className="text-sm text-white">High</p>
          <p className="text-xs text-gray-400 mt-1">Your portfolio is well-diversified across 6 sectors</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-green-500/10 rounded-xl p-3 border border-green-500/20"
        >
          <div className="flex items-center space-x-2 mb-2">
            <RocketLaunchIcon className="w-4 h-4 text-green-400" />
            <span className="text-xs font-medium text-green-400">Growth Opportunity</span>
          </div>
          <p className="text-sm text-white">Technology sector showing strong momentum</p>
          <p className="text-xs text-gray-400 mt-1">+15.5% growth in last quarter</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/20"
        >
          <div className="flex items-center space-x-2 mb-2">
            <ShieldCheckIcon className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-medium text-yellow-400">Risk Alert</span>
          </div>
          <p className="text-sm text-white">Energy sector showing increased volatility</p>
          <p className="text-xs text-gray-400 mt-1">Consider rebalancing position</p>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="bg-gray-700/30 rounded-lg p-2">
          <p className="text-xs text-gray-400">Dividend Yield</p>
          <p className="text-sm font-bold text-white">2.4%</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-2">
          <p className="text-xs text-gray-400">P/E Ratio</p>
          <p className="text-sm font-bold text-white">18.5</p>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-gray-800/50 via-gray-800/40 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <ChartPieIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Portfolio Analytics</h2>
            <p className="text-sm text-gray-400">Deep insights into your investments</p>
          </div>
        </div>

        {/* Live indicator */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
            isLive 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-gray-700 text-gray-400'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm font-medium">{isLive ? 'LIVE' : 'PAUSED'}</span>
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 p-1 bg-gray-700/30 rounded-xl">
        {[
          { id: 'overview', label: 'Overview', icon: PresentationChartLineIcon },
          { id: 'allocation', label: 'Allocation', icon: ChartPieIcon },
          { id: 'risk', label: 'Risk', icon: ShieldCheckIcon },
          { id: 'insights', label: 'Insights', icon: LightBulbIcon }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'allocation' && renderAllocation()}
          {activeTab === 'risk' && renderRisk()}
          {activeTab === 'insights' && renderInsights()}
        </motion.div>
      </AnimatePresence>

      {/* Expand/Collapse */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full mt-4 pt-4 border-t border-gray-700 flex items-center justify-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <InformationCircleIcon className="w-4 h-4" />
        <span>{showDetails ? 'Show less' : 'Show more details'}</span>
      </button>

      {/* Detailed Stats (Expandable) */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Total Investments</p>
                <p className="text-white font-medium">${totalValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Number of Holdings</p>
                <p className="text-white font-medium">{distribution.length}</p>
              </div>
              <div>
                <p className="text-gray-400">Last Updated</p>
                <div className="flex items-center text-white">
                  <ClockIcon className="w-4 h-4 mr-1 text-gray-400" />
                  <span className="text-sm">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400">Data Source</p>
                <div className="flex items-center text-white">
                  <DocumentTextIcon className="w-4 h-4 mr-1 text-gray-400" />
                  <span className="text-sm">Real-time</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PortfolioAnalytics;