import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, WalletIcon, ArrowTrendingUpIcon, CreditCardIcon, BookOpenIcon,
  MagnifyingGlassIcon, BellIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import StockCard from './StockCard';
import MarketSnapshot from './MarketSnapshot';
import PortfolioAnalytics from './PortfolioAnalytics';
import Watchlist from './Watchlist';
import TopStocks from './TopStocks';

export default function Dashboard(props) {
  const user = props.user;
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [selectedMarket, setSelectedMarket] = useState('NSE');
  
  const userStats = {
    name: user?.name || "Trader",
    balance: 500000,
    balanceChange: 5.63,
    nasdaq: 10,
    sse: "5D",
    euronext: "1M",
    bse: "6M"
  };

  // Indian Portfolio with Fallback Values (Prevents ₹0 if API fails)
  const portfolioHoldings = [
    { name: 'Reliance Ind.', symbol: 'RELIANCE.NS', shares: 10, fallbackValue: 2950.50, fallbackChange: .2 },
    { name: 'TCS', symbol: 'TCS.NS', shares: 15, fallbackValue: 4100.25, fallbackChange: -0.5 },
    { name: 'HDFC Bank', symbol: 'HDFCBANK.NS', shares: 8, fallbackValue: 1450.75, fallbackChange: 0.8 },
    { name: 'Infosys', symbol: 'INFY.NS', shares: 25, fallbackValue: 1600.00, fallbackChange: 1.5 },
    { name: 'Tata Motors', symbol: 'TATAMOTORS.NS', shares: 20, fallbackValue: 950.20, fallbackChange: 2.1 }
  ];

  const indicesToTrack = [
    { name: 'Nifty 50', symbol: '^NSEI', fallbackValue: 22500, fallbackChange: 0.8 },
    { name: 'Sensex', symbol: '^BSESN', fallbackValue: 74000, fallbackChange: 0.7 },
    { name: 'Nifty Bank', symbol: '^NSEBANK', fallbackValue: 48000, fallbackChange: -0.2 },
    { name: 'Nifty IT', symbol: '^CNXIT', fallbackValue: 35000, fallbackChange: 1.1 }
  ];

  const [myStocks, setMyStocks] = useState(
    portfolioHoldings.map(s => ({ ...s, value: s.fallbackValue, change: s.fallbackChange, isPositive: s.fallbackChange >= 0 }))
  );
  const [marketIndices, setMarketIndices] = useState(
    indicesToTrack.map(i => ({ ...i, value: i.fallbackValue, change: i.fallbackChange, isPositive: i.fallbackChange >= 0 }))
  );
  const [portfolioTotal, setPortfolioTotal] = useState(
    portfolioHoldings.reduce((acc, stock) => acc + (stock.fallbackValue * stock.shares), 0)
  );
  const [isDataLoading, setIsDataLoading] = useState(true);

  // ==========================================
  // REAL-TIME YAHOO FINANCE BATCH FETCH
  // ==========================================
  useEffect(() => {
    let isMounted = true;

    const fetchYahooData = async () => {
      try {
        const allSymbols = [...portfolioHoldings, ...indicesToTrack].map(item => item.symbol).join('%2C');
        
        const url = `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes?ticker=${allSymbols}`;
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': '8bef397fc4mshef8901db563bfe9p12177djsnfd7f5065b755',
            'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
          }
        };
        
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // Robust parser: Handles different array locations based on RapidAPI response
        let quotes = [];
        if (data.body && Array.isArray(data.body)) quotes = data.body;
        else if (Array.isArray(data)) quotes = data;
        else if (data.quoteResponse?.result) quotes = data.quoteResponse.result;

        if (quotes.length > 0 && isMounted) {
          const updatedStocks = portfolioHoldings.map(stock => {
            const liveData = quotes.find(q => q.symbol === stock.symbol);
            // Robust variable extraction to prevent showing 0
            const price = liveData?.regularMarketPrice ?? liveData?.price ?? stock.fallbackValue;
            const change = liveData?.regularMarketChangePercent ?? liveData?.changePercent ?? stock.fallbackChange;
            const high = liveData?.regularMarketDayHigh ?? liveData?.dayHigh ?? stock.fallbackValue * 1.02;
            const low = liveData?.regularMarketDayLow ?? liveData?.dayLow ?? stock.fallbackValue * 0.98;

            return {
              ...stock,
              value: price,
              change: change,
              high: high,
              low: low,
              isPositive: change >= 0
            };
          });

          const updatedIndices = indicesToTrack.map(index => {
            const liveData = quotes.find(q => q.symbol === index.symbol);
            const price = liveData?.regularMarketPrice ?? liveData?.price ?? index.fallbackValue;
            const change = liveData?.regularMarketChangePercent ?? liveData?.changePercent ?? index.fallbackChange;

            return {
              ...index,
              value: price,
              change: change,
              isPositive: change >= 0
            };
          });

          setMyStocks(updatedStocks);
          setMarketIndices(updatedIndices);
          setPortfolioTotal(updatedStocks.reduce((acc, stock) => acc + (stock.value * stock.shares), 0));
        }
      } catch (error) {
        console.error("Using fallback data due to API error:", error.message);
      } finally {
        if (isMounted) setIsDataLoading(false);
      }
    };

    fetchYahooData();
    const intervalId = setInterval(fetchYahooData, 15000); 

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const distributionData = myStocks.map((s) => ({ name: s.symbol.replace('.NS',''), value: s.value * s.shares }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF'];

  const performanceData = [
    { date: 'Jan', value: portfolioTotal * 0.85 },
    { date: 'Feb', value: portfolioTotal * 0.88 },
    { date: 'Mar', value: portfolioTotal * 0.92 },
    { date: 'Apr', value: portfolioTotal * 0.90 },
    { date: 'May', value: portfolioTotal * 0.96 },
    { date: 'Jun', value: portfolioTotal } 
  ];

  const quickNavItems = [
    { name: 'Dashboard', icon: ChartBarIcon, active: true },
    { name: 'Portfolio', icon: WalletIcon },
    { name: 'Trading', icon: ArrowTrendingUpIcon },
    { name: 'Wallet', icon: CreditCardIcon },
    { name: 'Tutorial', icon: BookOpenIcon }
  ];

  const formatINR = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num || 0);

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-white text-xl font-semibold">Syncing Live Market Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button onClick={props.onHome} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-white font-semibold text-xl">FinVerse</span>
            </button>

            <nav className="hidden lg:flex items-center space-x-1">
              {quickNavItems.map((item) => (
                <button key={item.name} className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${item.active ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"><MagnifyingGlassIcon className="w-5 h-5" /></button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 relative"><BellIcon className="w-5 h-5" /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span></button>
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"><Cog6ToothIcon className="w-5 h-5" /></button>
              {props.onLogout && (
                <button onClick={props.onLogout} className="flex items-center space-x-2 ml-2 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-all duration-200">
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-700">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Welcome back,</p>
                  <p className="text-white font-semibold">{userStats.name}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{userStats.name.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-2">Hello {userStats.name},</h1>
              <p className="text-blue-100">Here's your live Indian market overview for today</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Live Portfolio Holdings</h2>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All →</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myStocks.map((stock, index) => (
                  <StockCard 
                    key={index} 
                    stock={stock} 
                    onClick={() => props.onViewStock && props.onViewStock(stock.symbol)} // TRIGGERS NAVIGATION
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-700">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Live Portfolio Value</p>
                  <p className="text-2xl font-bold text-white">{formatINR(portfolioTotal)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Available Cash</p>
                  <p className="text-2xl font-bold text-white">{formatINR(userStats.balance)}</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Live Market Indices</h2>
                <div className="flex space-x-2">
                  {['NSE', 'BSE', 'NIFTY', 'SENSEX'].map((market) => (
                    <button key={market} onClick={() => setSelectedMarket(market)} className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${selectedMarket === market ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                      {market}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {marketIndices.map((index, i) => (
                  <div key={i} className="p-4 bg-gray-700/30 rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">{index.name}</p>
                    <p className="text-lg font-semibold text-white">{formatINR(index.value)}</p>
                    <p className={`text-sm ${index.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {index.isPositive ? '+' : ''}{index.change.toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Portfolio Performance</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performanceData}>
                  <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} />
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Portfolio Allocation</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={distributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {distributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <MarketSnapshot />
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center"><span className="text-gray-400">Nifty 50</span><span className="text-white font-medium">{marketIndices[0]?.value ? formatINR(marketIndices[0].value) : '--'}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400">Sensex</span><span className="text-white font-medium">{marketIndices[1]?.value ? formatINR(marketIndices[1].value) : '--'}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400">Euronext</span><span className="text-white font-medium">{userStats.euronext}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400">BSE</span><span className="text-white font-medium">{userStats.bse}</span></div>
              </div>
            </motion.div>

            <PortfolioAnalytics performanceData={performanceData} distributionData={distributionData} COLORS={COLORS} />
            <TopStocks />
            <Watchlist />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 flex justify-center space-x-2">
          {['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y'].map((tf) => (
            <button key={tf} onClick={() => setSelectedTimeframe(tf)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedTimeframe === tf ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>{tf}</button>
          ))}
        </motion.div>
      </main>
    </div>
  );
}