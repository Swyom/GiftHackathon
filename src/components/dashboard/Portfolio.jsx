import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import {
  TrashIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ChartPieIcon,
  BanknotesIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function Portfolio() {
  const [stocks, setStocks] = useState([
    {
      id: 1,
      name: 'NVIDIA',
      symbol: 'NVDA',
      quantity: 10,
      buyPrice: 450,
      currentPrice: 875,
      invested: 4500,
      current: 8750,
      historicalData: [
        { month: 'Jan', value: 4500 },
        { month: 'Feb', value: 4800 },
        { month: 'Mar', value: 5500 },
        { month: 'Apr', value: 6200 },
        { month: 'May', value: 7100 },
        { month: 'Jun', value: 8750 }
      ]
    },
    {
      id: 2,
      name: 'Apple',
      symbol: 'AAPL',
      quantity: 15,
      buyPrice: 150,
      currentPrice: 195,
      invested: 2250,
      current: 2925,
      historicalData: [
        { month: 'Jan', value: 2250 },
        { month: 'Feb', value: 2350 },
        { month: 'Mar', value: 2450 },
        { month: 'Apr', value: 2600 },
        { month: 'May', value: 2800 },
        { month: 'Jun', value: 2925 }
      ]
    },
    {
      id: 3,
      name: 'Tesla',
      symbol: 'TSLA',
      quantity: 5,
      buyPrice: 220,
      currentPrice: 245,
      invested: 1100,
      current: 1225,
      historicalData: [
        { month: 'Jan', value: 1100 },
        { month: 'Feb', value: 1120 },
        { month: 'Mar', value: 1180 },
        { month: 'Apr', value: 1200 },
        { month: 'May', value: 1215 },
        { month: 'Jun', value: 1225 }
      ]
    },
    {
      id: 4,
      name: 'Microsoft',
      symbol: 'MSFT',
      quantity: 8,
      buyPrice: 320,
      currentPrice: 420,
      invested: 2560,
      current: 3360,
      historicalData: [
        { month: 'Jan', value: 2560 },
        { month: 'Feb', value: 2700 },
        { month: 'Mar', value: 2900 },
        { month: 'Apr', value: 3050 },
        { month: 'May', value: 3200 },
        { month: 'Jun', value: 3360 }
      ]
    }
  ]);

  // Calculate portfolio metrics
  const totalInvested = stocks.reduce((sum, stock) => sum + stock.invested, 0);
  const totalCurrent = stocks.reduce((sum, stock) => sum + stock.current, 0);
  const totalProfitLoss = totalCurrent - totalInvested;
  const percentageReturn = ((totalProfitLoss / totalInvested) * 100).toFixed(2);
  const isPositive = totalProfitLoss >= 0;

  // Prepare pie chart data
  const pieData = stocks.map((stock) => ({
    name: stock.symbol,
    value: stock.current,
    fullName: stock.name
  }));

  // Calculate risk level
  const getRiskLevel = () => {
    const maxAllocation = Math.max(...stocks.map((s) => (s.current / totalCurrent) * 100));
    if (maxAllocation > 60) return { level: 'High', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
    if (maxAllocation > 40) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
    return { level: 'Low', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
  };

  const riskLevel = getRiskLevel();

  // Get AI Insights
  const getInsights = () => {
    const insights = [];
    const maxAllocation = Math.max(...stocks.map((s) => (s.current / totalCurrent) * 100));
    
    if (maxAllocation > 60) {
      insights.push({
        icon: ExclamationTriangleIcon,
        text: `High concentration in ${stocks[stocks.map((s) => (s.current / totalCurrent) * 100).indexOf(maxAllocation)].symbol}. Consider diversifying.`,
        type: 'warning'
      });
    }

    const topGainer = stocks.reduce((prev, current) =>
      ((current.current - current.invested) / current.invested * 100) >
        ((prev.current - prev.invested) / prev.invested * 100) ? current : prev
    );
    insights.push({
      icon: ArrowTrendingUpIcon,
      text: `${topGainer.symbol} is your top performer with ${(((topGainer.current - topGainer.invested) / topGainer.invested * 100)).toFixed(1)}% gains.`,
      type: 'positive'
    });

    if (stocks.length < 6) {
      insights.push({
        icon: SparklesIcon,
        text: `Add 1-2 more stocks to improve diversification and reduce portfolio risk.`,
        type: 'suggestion'
      });
    }

    return insights.slice(0, 3);
  };

  const insights = getInsights();

  const handleRemoveStock = (id) => {
    setStocks(stocks.filter((stock) => stock.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Investment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-900/40 to-blue-900/10 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-500/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400 uppercase tracking-wide">Total Investment</p>
            <BanknotesIcon className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">${totalInvested.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">{stocks.length} stocks</p>
        </motion.div>

        {/* Current Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-cyan-900/40 to-cyan-900/10 rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-500/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400 uppercase tracking-wide">Current Value</p>
            <ArrowTrendingUpIcon className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-bold text-white">${totalCurrent.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Market value</p>
        </motion.div>

        {/* Total Profit/Loss */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl p-6 border transition-colors bg-gradient-to-br ${
            isPositive
              ? 'from-green-900/40 to-green-900/10 border-green-500/30 hover:border-green-500/50'
              : 'from-red-900/40 to-red-900/10 border-red-500/30 hover:border-red-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400 uppercase tracking-wide">Total Profit/Loss</p>
            {isPositive ? (
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
            ) : (
              <ArrowTrendingDownIcon className="w-5 h-5 text-red-400" />
            )}
          </div>
          <p className={`text-3xl font-bold ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
            ${Math.abs(totalProfitLoss).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">{isPositive ? 'Gain' : 'Loss'}</p>
        </motion.div>

        {/* Percentage Return */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl p-6 border transition-colors bg-gradient-to-br ${
            isPositive
              ? 'from-emerald-900/40 to-emerald-900/10 border-emerald-500/30 hover:border-emerald-500/50'
              : 'from-orange-900/40 to-orange-900/10 border-orange-500/30 hover:border-orange-500/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-400 uppercase tracking-wide">Return %</p>
            <ChartPieIcon className="w-5 h-5 text-emerald-400" />
          </div>
          <p className={`text-3xl font-bold ${isPositive ? 'text-emerald-300' : 'text-orange-300'}`}>
            {percentageReturn}%
          </p>
          <p className="text-xs text-gray-500 mt-2">On investment</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart and Risk Analysis */}
        <div className="lg:col-span-1 space-y-6">
          {/* Allocation Pie Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Portfolio Allocation</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="mt-4 space-y-2">
              {pieData.map((stock, idx) => {
                const percentage = ((stock.value / totalCurrent) * 100).toFixed(1);
                return (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: COLORS[idx % COLORS.length] }}
                      />
                      <span className="text-gray-300">{stock.name}</span>
                    </div>
                    <span className="text-gray-400">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Risk Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`rounded-2xl p-6 border ${riskLevel.bg} ${riskLevel.border}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheckIcon className={`w-6 h-6 ${riskLevel.color}`} />
              <h3 className="text-xl font-semibold text-white">Risk Analysis</h3>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Risk Level</p>
              <p className={`text-2xl font-bold ${riskLevel.color}`}>{riskLevel.level}</p>
            </div>

            {/* Top 3 Holdings */}
            <div className="space-y-3">
              <p className="text-sm text-gray-400 font-semibold">Top Holdings</p>
              {stocks
                .map((stock) => ({
                  ...stock,
                  percentage: ((stock.current / totalCurrent) * 100).toFixed(1)
                }))
                .sort((a, b) => b.percentage - a.percentage)
                .slice(0, 3)
                .map((stock, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{stock.symbol}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                          style={{ width: `${stock.percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-400 min-w-fit">{stock.percentage}%</span>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* Stock List and Insights */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stock List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Holdings</h3>
            <div className="space-y-3">
              {stocks.map((stock, idx) => {
                const profitLoss = stock.current - stock.invested;
                const profitLossPercent = ((profitLoss / stock.invested) * 100).toFixed(2);
                const isGain = profitLoss >= 0;

                return (
                  <motion.div
                    key={stock.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50 hover:border-gray-500/50 transition-all group"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
                      {/* Stock Info */}
                      <div className="sm:col-span-2">
                        <p className="font-semibold text-white">{stock.name}</p>
                        <p className="text-sm text-gray-400">{stock.symbol}</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: {stock.quantity}</p>
                      </div>

                      {/* Prices */}
                      <div className="sm:col-span-1">
                        <p className="text-xs text-gray-400 mb-1">Buy Price</p>
                        <p className="text-white font-medium">${stock.buyPrice.toFixed(2)}</p>
                      </div>

                      <div className="sm:col-span-1">
                        <p className="text-xs text-gray-400 mb-1">Current</p>
                        <p className="text-white font-medium">${stock.currentPrice.toFixed(2)}</p>
                      </div>

                      {/* Profit/Loss */}
                      <div className="sm:col-span-1">
                        <p className="text-xs text-gray-400 mb-1">P/L</p>
                        <div className="flex items-center gap-1">
                          {isGain ? (
                            <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />
                          )}
                          <p className={`font-medium ${isGain ? 'text-green-400' : 'text-red-400'}`}>
                            {profitLossPercent}%
                          </p>
                        </div>
                      </div>

                      {/* Value */}
                      <div className="sm:col-span-1">
                        <p className="text-xs text-gray-400 mb-1">Value</p>
                        <p className="text-white font-medium">${stock.current.toLocaleString()}</p>
                      </div>

                      {/* Remove Button */}
                      <div className="sm:col-span-1 flex items-end">
                        <button
                          onClick={() => handleRemoveStock(stock.id)}
                          className="w-full sm:w-auto px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all border border-red-500/20 hover:border-red-500/50"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl p-6 border border-purple-500/30"
          >
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold text-white">AI Portfolio Insights</h3>
            </div>

            <div className="space-y-3">
              {insights.map((insight, idx) => {
                const IconComponent = insight.icon;
                const bgColor =
                  insight.type === 'warning'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : insight.type === 'positive'
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-blue-500/10 border-blue-500/30';

                const textColor =
                  insight.type === 'warning'
                    ? 'text-yellow-400'
                    : insight.type === 'positive'
                    ? 'text-green-400'
                    : 'text-blue-400';

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className={`flex gap-3 p-3 rounded-lg border ${bgColor}`}
                  >
                    <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${textColor}`} />
                    <p className="text-sm text-gray-300">{insight.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
