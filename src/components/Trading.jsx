import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

function Trading() {
  // Paper trading state
  const [balance, setBalance] = useState(100000); // starting balance
  const [positions, setPositions] = useState([]); // open positions
  const [tradeHistory, setTradeHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(50);
  const [amount, setAmount] = useState(100);
  const [shares, setShares] = useState(1);
  const [selectedTicker, setSelectedTicker] = useState('NIFTY');
  const [openPrice, setOpenPrice] = useState(50);
  const [highPrice, setHighPrice] = useState(50);
  const [lowPrice, setLowPrice] = useState(50);
  const [predictedProfit, setPredictedProfit] = useState(0);
  const [lastAction, setLastAction] = useState(null); // 'BUY' or 'SELL'
  const [timeLimit, setTimeLimit] = useState(5); // in minutes (1, 5, or 1440 for 1 day)
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // in seconds
  const [tradeStartTime, setTradeStartTime] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [sessionProfit, setSessionProfit] = useState(0);

  // Generate realistic OHLC candles
  useEffect(() => {
    const initialData = Array.from({ length: 20 }, (_, i) => {
      const open = 50 + Math.random() * 10;
      const close = open + (Math.random() - 0.5) * 5;
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;
      return {
        time: `${10 + i}:00`,
        open: parseFloat(open.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        range: [parseFloat(low.toFixed(2)), parseFloat(high.toFixed(2))],
      };
    });
    setChartData(initialData);
    const lastCandle = initialData[initialData.length - 1];
    setCurrentPrice(lastCandle.close);
    setOpenPrice(lastCandle.open);
    setHighPrice(lastCandle.high);
    setLowPrice(lastCandle.low);

    // Update candles every 3 seconds for real-time effect
    const interval = setInterval(() => {
      setChartData((prev) => {
        const lastCandle = prev[prev.length - 1];
        const newData = [...prev.slice(1)];
        
        const open = lastCandle.close + (Math.random() - 0.5) * 2;
        const close = open + (Math.random() - 0.5) * 5;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        
        const newCandle = {
          time: new Date().toLocaleTimeString(),
          open: parseFloat(open.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          range: [parseFloat(low.toFixed(2)), parseFloat(high.toFixed(2))],
        };
        
        newData.push(newCandle);
        setCurrentPrice(newCandle.close);
        setOpenPrice(newCandle.open);
        setHighPrice(newCandle.high);
        setLowPrice(newCandle.low);
        
        // Calculate predicted profit/loss
        if (amount > 0) {
          const estimatedShares = Math.floor(amount / newCandle.close);
          const entryPrice = lastAction === 'BUY' ? newCandle.close : (lastAction === 'SELL' ? newCandle.close : amount / estimatedShares);
          const projectedProfit = ((newCandle.close - entryPrice) * estimatedShares);
          setPredictedProfit(projectedProfit);
        }
        
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update predicted profit when amount changes
  useEffect(() => {
    if (amount > 0 && currentPrice > 0) {
      const estShares = Math.floor(amount / currentPrice);
      const projProfit = lastAction === 'BUY' 
        ? (currentPrice - (amount / estShares)) * estShares
        : ((amount / estShares) - currentPrice) * estShares;
      setPredictedProfit(projProfit);
    }
  }, [amount, currentPrice, lastAction]);

  // Timer effect - countdown and check if time is up
  useEffect(() => {
    if (!tradeStartTime || isTimeUp) return;

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - tradeStartTime) / 1000);
      const remaining = Math.max(0, (timeLimit * 60) - elapsedSeconds);
      setTimeRemaining(remaining);

      if (remaining === 0) {
        setIsTimeUp(true);
        // Calculate final profit
        const totalTradeProfit = positions.reduce((sum, pos) => {
          return sum + ((currentPrice - pos.entryPrice) * pos.shares);
        }, 0);
        setSessionProfit(totalTradeProfit + (balance - 100000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tradeStartTime, timeLimit, isTimeUp, positions, currentPrice, balance]);

  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle time limit change
  const handleTimeLimitChange = (minutes) => {
    setTimeLimit(minutes);
    setTimeRemaining(minutes * 60);
    setTradeStartTime(null);
    setIsTimeUp(false);
    setSessionProfit(0);
  };

  // Start trading session
  const startTradingSession = () => {
    setTradeStartTime(Date.now());
    setIsTimeUp(false);
    setSessionProfit(0);
  };

  // Analyze recent chart data and trade outcome to generate a human-friendly reason
  const analyzeTradeReason = ({ type, entryPrice, exitPrice = null, sharesCount = 0 }) => {
    // use last 5 closes to detect short-term trend and volatility
    const closes = chartData.slice(-5).map((c) => c.close);
    const highs = chartData.slice(-5).map((c) => c.high);
    const lows = chartData.slice(-5).map((c) => c.low);
    const first = closes[0] ?? currentPrice;
    const last = closes[closes.length - 1] ?? currentPrice;
    const trend = last - first; // positive => upward short-term trend
    const avgVol = (highs.reduce((s, v, i) => s + (highs[i] - lows[i]), 0) / (highs.length || 1));

    const volatility = avgVol;
    const trendLabel = trend > 0.5 ? 'short-term uptrend' : trend < -0.5 ? 'short-term downtrend' : 'sideways movement';
    const volatilityLabel = volatility > 2 ? 'high volatility' : 'moderate volatility';

    if (type === 'OPEN') {
      // Reason for opening a position (what made the trader expect profit)
      if (trend > 0.5) {
        return `Opened during a ${trendLabel} with ${volatilityLabel} — expecting price appreciation.`;
      }
      if (trend < -0.5) {
        return `Opened while market showed a ${trendLabel}; position is risky and could decline further.`;
      }
      return `Opened during ${trendLabel} with ${volatilityLabel}; trade depends on short-term momentum or reversal.`;
    }

    // CLOSED trade reason (realized profit/loss)
    if (type === 'CLOSED') {
      if (exitPrice == null || entryPrice == null) return 'Insufficient data to compute reason.';
      const pnl = exitPrice - entryPrice;
      if (pnl > 0) {
        // Profit: explain if due to trend or volatility spike
        if (trend > 0.5) return `Profit realized because of a ${trendLabel} — price moved up after entry.`;
        if (volatility > 2) return `Profit realized due to a short-term price spike during ${volatilityLabel}.`;
        return `Profit realized primarily from favorable price movement after entry.`;
      }
      // Loss: explain if due to reversal or volatility
      if (pnl < 0) {
        if (trend < -0.5) return `Loss occurred as the market followed a ${trendLabel} after entry, pushing price down.`;
        if (volatility > 2) return `Loss occurred due to ${volatilityLabel} and a rapid adverse move.`;
        return `Loss occurred because price moved against the entry position after trade.`;
      }
      return 'Trade closed at breakeven; minor fluctuations cancelled out.';
    }

    return '';
  };

  // Handle buy action
  const handleBuy = () => {
    if (balance >= amount && !isTimeUp) {
      if (!tradeStartTime) startTradingSession();
      
      const newPosition = {
        id: Date.now(),
        ticker: selectedTicker,
        type: 'BUY',
        symbol: '↑',
        shares,
        entryPrice: currentPrice,
        totalCost: amount,
        timestamp: new Date().toLocaleTimeString(),
        projectedProfit: predictedProfit,
      };
      // attach a reason for opening the position
      newPosition.reason = analyzeTradeReason({ type: 'OPEN', entryPrice: newPosition.entryPrice, sharesCount: newPosition.shares });

      setPositions([...positions, newPosition]);
      setBalance(balance - amount);
      setTradeHistory([newPosition, ...tradeHistory]);
      setLastAction('BUY');
    }
  };

  // Handle sell action
  const handleSell = () => {
    if (positions.length > 0 && !isTimeUp) {
      if (!tradeStartTime) startTradingSession();
      
      const positionToSell = positions[0];
      const saleProceeds = amount;
      const profit = saleProceeds - positionToSell.totalCost;

      const trade = {
        id: Date.now(),
        ticker: selectedTicker,
        type: 'SELL',
        symbol: '↓',
        shares,
        exitPrice: currentPrice,
        totalProceeds: amount,
        profit,
        timestamp: new Date().toLocaleTimeString(),
        projectedProfit: predictedProfit,
      };

      // attach reason explaining why this trade realized profit/loss
      trade.reason = analyzeTradeReason({ type: 'CLOSED', entryPrice: positionToSell.entryPrice, exitPrice: trade.exitPrice, sharesCount: positionToSell.shares });

      setPositions(positions.slice(1));
      setBalance(balance + amount);
      setTradeHistory([trade, ...tradeHistory]);
      setLastAction('SELL');
    }
  };

  // Calculate portfolio value
  const portfolioValue = balance + positions.reduce((sum, pos) => sum + pos.totalCost, 0);
  const totalProfit = portfolioValue - 100000;
  const profitPercent = ((totalProfit / 100000) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Paper Trading</h1>
        <p className="text-gray-400">Practice trading with simulated funds and real-time price movements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Time Limit Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Trading Session Time Limit</h3>
            <div className="flex gap-3 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTimeLimitChange(1)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  timeLimit === 1
                    ? 'bg-blue-500 text-white border border-blue-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } ${tradeStartTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!!tradeStartTime}
              >
                1 Minute
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTimeLimitChange(5)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  timeLimit === 5
                    ? 'bg-blue-500 text-white border border-blue-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } ${tradeStartTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!!tradeStartTime}
              >
                5 Minutes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTimeLimitChange(1440)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  timeLimit === 1440
                    ? 'bg-blue-500 text-white border border-blue-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } ${tradeStartTime ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!!tradeStartTime}
              >
                1 Day
              </motion.button>
            </div>
            {tradeStartTime && (
              <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-gray-400">Time Remaining</p>
                <p className={`text-4xl font-bold font-mono ${
                  timeRemaining <= 60 ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
            )}
          </motion.div>

          {/* Trading Chart - Candlestick */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border ${
              isTimeUp ? 'border-red-500 bg-red-900/20' : 'border-gray-700'
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">NIFTY 50 Candlestick Chart</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {isTimeUp ? '⏱️ Trading Time Ended' : 'Real-time candlestick analysis'}
                </p>
              </div>
              <div className="text-right">
                {isTimeUp && (
                  <div className="mb-3 p-3 bg-red-500/30 border border-red-500 rounded-lg">
                    <p className="text-xs text-red-400 mb-1">SESSION ENDED</p>
                    <p className={`text-2xl font-bold ${sessionProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {sessionProfit >= 0 ? '+' : ''}₹{sessionProfit.toFixed(2)}
                    </p>
                  </div>
                )}
                <p className="text-3xl font-bold text-white">₹{currentPrice.toFixed(2)}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <div>
                    <p className="text-gray-400">Open: <span className="text-white font-semibold">₹{openPrice.toFixed(2)}</span></p>
                  </div>
                  <div>
                    <p className="text-gray-400">High: <span className="text-green-400 font-semibold">₹{highPrice.toFixed(2)}</span></p>
                  </div>
                  <div>
                    <p className="text-gray-400">Low: <span className="text-red-400 font-semibold">₹{lowPrice.toFixed(2)}</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Candlestick Chart */}
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => `₹${value.toFixed(2)}`}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                
                {/* High-Low range */}
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="#10b981"
                  strokeWidth={1}
                  dot={false}
                  isAnimationActive={false}
                  opacity={0.3}
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke="#ef4444"
                  strokeWidth={1}
                  dot={false}
                  isAnimationActive={false}
                  opacity={0.3}
                />
                
                {/* Candlestick bodies */}
                <Bar
                  dataKey="open"
                  fill="#8884d8"
                  shape={
                    <CandleStick
                      close={chartData}
                      open={chartData}
                    />
                  }
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
            
            {/* Prediction Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-lg border border-blue-500/30">
              <p className="text-sm text-gray-400 mb-2">Projected Profit/Loss</p>
              <p className={`text-2xl font-bold ${predictedProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {predictedProfit >= 0 ? '+' : ''}₹{predictedProfit.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Based on current price of ₹{currentPrice.toFixed(2)} and amount ₹{amount}</p>
            </div>
          </motion.div>

          {/* Trading Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Execute Trade</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Ticker Selection */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Ticker</label>
                <select
                  value={selectedTicker}
                  onChange={(e) => setSelectedTicker(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-500 outline-none"
                >
                  <option>NIFTY</option>
                  <option>SENSEX</option>
                  <option>BANK NIFTY</option>
                  <option>IT NIFTY</option>
                </select>
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(parseFloat(e.target.value));
                    setShares(Math.floor(parseFloat(e.target.value) / currentPrice));
                  }}
                  className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Shares Display */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Shares</label>
                <input
                  type="number"
                  value={shares}
                  readOnly
                  className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 opacity-50"
                />
              </div>

              {/* Price Display */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Entry Price (₹)</label>
                <input
                  type="number"
                  value={currentPrice.toFixed(2)}
                  readOnly
                  className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 opacity-50"
                />
              </div>
            </div>

            {/* Buy/Sell Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <motion.button
                whileHover={!isTimeUp ? { scale: 1.05 } : {}}
                whileTap={!isTimeUp ? { scale: 0.95 } : {}}
                onClick={handleBuy}
                disabled={balance < amount || isTimeUp}
                className={`text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  isTimeUp
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : balance < amount
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                }`}
              >
                <ArrowTrendingUpIcon className="w-5 h-5" />
                <span>BUY</span>
              </motion.button>
              <motion.button
                whileHover={!isTimeUp ? { scale: 1.05 } : {}}
                whileTap={!isTimeUp ? { scale: 0.95 } : {}}
                onClick={handleSell}
                disabled={positions.length === 0 || isTimeUp}
                className={`text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  isTimeUp
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : positions.length === 0
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                }`}
              >
                <ArrowTrendingDownIcon className="w-5 h-5" />
                <span>SELL</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar - Portfolio Stats */}
        <div className="space-y-6">
          {/* Portfolio Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-2xl p-6 border transition-all ${
              isTimeUp
                ? 'bg-gradient-to-br from-red-900/40 to-red-900/10 border-red-500/30'
                : 'bg-gradient-to-br from-blue-900/40 to-blue-900/10 border-blue-500/30'
            }`}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Portfolio</h3>
            {isTimeUp ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Final Account Balance</p>
                  <p className="text-2xl font-bold text-white">₹{balance.toFixed(2)}</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30">
                  <p className="text-sm text-red-400 mb-1">⏱️ TRADING SESSION ENDED</p>
                  <p className={`text-3xl font-bold ${sessionProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    Total P&L: {sessionProfit >= 0 ? '+' : ''}₹{sessionProfit.toFixed(2)}
                  </p>
                  <p className={`text-sm mt-2 ${sessionProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {sessionProfit >= 0 ? 'Profit' : 'Loss'}: {((sessionProfit / 100000) * 100).toFixed(2)}%
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setBalance(100000);
                    setPositions([]);
                    setTradeHistory([]);
                    setTradeStartTime(null);
                    setIsTimeUp(false);
                    setSessionProfit(0);
                  }}
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition-all"
                >
                  Start New Session
                </motion.button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Account Balance</p>
                  <p className="text-2xl font-bold text-white">₹{balance.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold text-white">₹{portfolioValue.toFixed(2)}</p>
                </div>
                <div className={`p-3 rounded-lg ${totalProfit >= 0 ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                  <p className="text-sm text-gray-400">Current P&L</p>
                  <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₹{totalProfit.toFixed(2)}
                  </p>
                  <p className={`text-sm ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalProfit >= 0 ? '+' : ''}{profitPercent}%
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Open Positions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Open Positions ({positions.length})</h3>
            <div className="space-y-3">
              {positions.length === 0 ? (
                <p className="text-gray-400 text-sm">No open positions</p>
              ) : (
                positions.map((pos) => (
                  <div key={pos.id} className="bg-gray-700/30 rounded-lg p-3">
                    <p className="text-sm font-semibold text-white">{pos.ticker}</p>
                    <p className="text-xs text-gray-400">{pos.shares} shares @ ₹{pos.entryPrice.toFixed(2)}</p>
                    <p className="text-sm text-blue-400">₹{pos.totalCost.toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Trade History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Trade History</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {tradeHistory.length === 0 ? (
                <p className="text-gray-400 text-sm">No trades yet</p>
              ) : (
                tradeHistory.map((trade) => (
                  <div key={trade.id} className="flex justify-between items-start text-xs bg-gray-700/30 rounded-lg p-3">
                    <div className="flex-1 pr-3">
                      <p className={`font-bold text-lg ${trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.symbol} {trade.type}
                      </p>
                      <p className="text-gray-400">{trade.timestamp}</p>
                      <p className="text-gray-500 text-xs mt-1">{trade.ticker}</p>
                      {trade.reason && (
                        <p className="text-sm text-gray-300 mt-2">{trade.reason}</p>
                      )}
                    </div>
                    <div className="text-right w-36">
                      <p className="text-white font-semibold">₹{trade.totalCost?.toFixed(2) || trade.totalProceeds?.toFixed(2)}</p>
                      {trade.projectedProfit && (
                        <p className={trade.projectedProfit >= 0 ? 'text-green-400' : 'text-red-400'} title="Projected Profit/Loss">
                          {trade.projectedProfit >= 0 ? '+' : ''}₹{trade.projectedProfit.toFixed(2)}
                        </p>
                      )}
                      {trade.profit && (
                        <p className={trade.profit >= 0 ? 'text-green-400' : 'text-red-400'} title="Realized Profit/Loss">
                          P&L: {trade.profit >= 0 ? '+' : ''}₹{trade.profit.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Custom Candlestick renderer
const CandleStick = (props) => {
  const { x, y, width, height, payload } = props;
  if (!payload) return null;
  
  const { open, close, high, low } = payload;
  if (!open || !close || !high || !low) return null;
  
  const xMid = x + width / 2;
  const yScale = height / (Math.max(...[open, close, high, low]) - Math.min(...[open, close, high, low]) + 1);
  const yOffset = y + height / 2;
  
  const yHigh = yOffset - (high - low) * yScale / 2;
  const yLow = yOffset + (high - low) * yScale / 2;
  const yOpen = yOffset + (open - (high + low) / 2) * yScale / 2;
  const yClose = yOffset + (close - (high + low) / 2) * yScale / 2;
  
  const isGreen = close >= open;
  const color = isGreen ? '#10b981' : '#ef4444';
  
  return (
    <g>
      {/* Wick (high-low line) */}
      <line x1={xMid} y1={yHigh} x2={xMid} y2={yLow} stroke={color} strokeWidth={1} />
      {/* Body (open-close) */}
      <rect
        x={xMid - width / 3}
        y={Math.min(yOpen, yClose)}
        width={(width / 3) * 2}
        height={Math.abs(yClose - yOpen) || 2}
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

export default Trading;
