import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function StockDetail({ stockSymbol, onBack }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [orderType, setOrderType] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  
  // Real-time market data state
  const [liveData, setLiveData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const availableBuyingPower = 500000; // ₹5,00,000

  // 1. Symbol Converters
  const cleanSymbol = stockSymbol ? stockSymbol.replace('.NS', '').replace('.BO', '') : 'NSE';
  
  // PERFECTED TRADINGVIEW MAPPING
  const getTradingViewSymbol = (symbol) => {
    if (!symbol) return "BSE:SENSEX";
    if (symbol.endsWith('.NS')) return `BSE:${symbol.replace('.NS', '')}`; 
    if (symbol.endsWith('.BO')) return `BSE:${symbol.replace('.BO', '')}`;
    if (symbol === '^NSEI') return "NSE:NIFTY";
    if (symbol === '^BSESN') return "BSE:SENSEX";
    if (symbol === '^NSEBANK') return "NSE:BANKNIFTY";
    if (symbol === '^CNXIT') return "NSE:CNXIT";
    return `BSE:${symbol}`;
  };

  const tvSymbol = getTradingViewSymbol(stockSymbol);
  const containerId = `tv_chart_${cleanSymbol}_${Math.random().toString(36).substring(2, 9)}`;

  // 2. Fetch Live Price from Yahoo Finance
  useEffect(() => {
    let isMounted = true;
    
    const fetchLivePrice = async () => {
      if (!stockSymbol) return;
      
      try {
        const url = `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes?ticker=${stockSymbol}`;
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': '8bef397fc4mshef8901db563bfe9p12177djsnfd7f5065b755',
            'x-rapidapi-host': 'yahoo-finance15.p.rapidapi.com'
          }
        };

        const response = await fetch(url, options);
        if (!response.ok) throw new Error("API Request Failed");
        const data = await response.json();
        
        // Robust parser to handle different API response structures
        let quotes = [];
        if (data.body && Array.isArray(data.body)) quotes = data.body;
        else if (Array.isArray(data)) quotes = data;
        else if (data.quoteResponse?.result) quotes = data.quoteResponse.result;

        if (quotes.length > 0 && isMounted) {
          setLiveData(quotes[0]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching live detail data:", error);
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLivePrice();
    const interval = setInterval(fetchLivePrice, 15000); // Live update every 15s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [stockSymbol]);

  // 3. Inject TradingView Advanced Candlestick Chart
  useEffect(() => {
    const timer = setTimeout(() => {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = ''; 

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (typeof window.TradingView !== 'undefined') {
          new window.TradingView.widget({
            autosize: true,
            symbol: tvSymbol, 
            interval: "D",
            timezone: "Asia/Kolkata",
            theme: "dark",
            style: "1", 
            locale: "in",
            enable_publishing: false,
            backgroundColor: "rgba(17, 24, 39, 1)", 
            gridColor: "rgba(31, 41, 55, 0.5)",
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: false,
            container_id: containerId,
            toolbar_bg: "rgba(17, 24, 39, 1)"
          });
        }
      };
      
      container.appendChild(script);
    }, 100); 

    return () => clearTimeout(timer);
  }, [tvSymbol, containerId]);

  // Safe Data Extractors (Prevents ₹0)
  const formatINR = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num || 0);
  
  const currentPrice = liveData?.regularMarketPrice ?? liveData?.price ?? liveData?.currentPrice ?? 0;
  const changePercent = liveData?.regularMarketChangePercent ?? liveData?.changePercent ?? 0;
  const isPositive = changePercent >= 0;
  
  const dayHigh = liveData?.regularMarketDayHigh ?? liveData?.dayHigh ?? 0;
  const dayLow = liveData?.regularMarketDayLow ?? liveData?.dayLow ?? 0;
  const prevClose = liveData?.regularMarketPreviousClose ?? liveData?.previousClose ?? 0;
  const volume = liveData?.regularMarketVolume ?? liveData?.volume ?? 0;
  
  const estimatedCost = currentPrice * quantity;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* PROFESSIONAL HEADER */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button onClick={onBack} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg">
                {cleanSymbol.charAt(0)}
              </div>
              <div>
                <div className="flex items-baseline space-x-3">
                  <h1 className="text-2xl font-bold text-white tracking-tight">{cleanSymbol}</h1>
                  <span className="text-xs text-blue-400 font-medium px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20">Indian Equities</span>
                </div>
                
                {/* TOP HEADER: SHIMMER EFFECT OR LIVE PRICE */}
                {isLoading ? (
                  <div className="flex items-center space-x-3 mt-1.5">
                    <div className="h-6 w-24 bg-gray-700/50 rounded-md animate-pulse"></div>
                    <div className="h-5 w-12 bg-gray-800 rounded-md animate-pulse"></div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-lg font-semibold text-white">{formatINR(currentPrice)}</span>
                    <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                    </span>
                  </div>
                )}

              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsFavorite(!isFavorite)} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
              {isFavorite ? <StarSolid className="w-6 h-6 text-yellow-400" /> : <StarIcon className="w-6 h-6 text-gray-400 hover:text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN TRADING TERMINAL */}
      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6 h-[calc(100vh-85px)]">
        
        {/* LEFT SIDE: ADVANCED CANDLESTICK CHART */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="flex-1 lg:w-2/3 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden relative shadow-2xl min-h-[500px]"
        >
          <div id={containerId} className="h-full w-full absolute inset-0" />
        </motion.div>

        {/* RIGHT SIDE: PROFESSIONAL ORDER ENTRY & STATS */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:w-1/3 w-full flex flex-col gap-6">
          
          {/* Order Panel */}
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-6">Place Order</h2>
            
            {/* Buy / Sell Toggles */}
            <div className="flex bg-gray-900 p-1 rounded-xl mb-6 border border-gray-800">
              <button onClick={() => setOrderType('buy')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${orderType === 'buy' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-gray-400 hover:text-white'}`}>
                Buy
              </button>
              <button onClick={() => setOrderType('sell')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${orderType === 'sell' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-white'}`}>
                Sell
              </button>
            </div>

            {/* Input Form */}
            <div className="space-y-5 flex-1">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Order Type</label>
                <select className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none">
                  <option>Market Order (Execute Immediately)</option>
                  <option>Limit Order</option>
                  <option>Stop Loss</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Quantity (Shares)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-4 pr-12 py-3.5 text-white text-lg font-semibold focus:outline-none focus:border-blue-500 transition-colors" 
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">Qty</span>
                </div>
              </div>

              {/* Live Cost Calculation */}
              <div className="pt-5 mt-2 border-t border-gray-700/50 space-y-3">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-400">Current Market Price</span>
                  {isLoading ? (
                    <div className="h-5 w-20 bg-gray-700/50 rounded animate-pulse"></div>
                  ) : (
                    <span className="text-white font-medium">{formatINR(currentPrice)}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-gray-400">Estimated Cost</span>
                  {isLoading ? (
                    <div className="h-6 w-24 bg-gray-700/50 rounded animate-pulse"></div>
                  ) : (
                    <span className="text-white font-bold text-lg">{formatINR(estimatedCost)}</span>
                  )}
                </div>
                <div className="flex justify-between text-xs pt-2">
                  <span className="text-gray-500">Available Margin</span>
                  <span className="text-gray-300 font-medium">{formatINR(availableBuyingPower)}</span>
                </div>
              </div>
            </div>

            <button className={`w-full py-4 mt-6 rounded-xl font-bold text-white text-lg transition-all hover:scale-[1.02] shadow-xl ${orderType === 'buy' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'}`}>
              {orderType === 'buy' ? 'Confirm Buy Order' : 'Confirm Sell Order'}
            </button>
          </div>

          {/* Market Depth / Live Stats Panel */}
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Today's Market Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              
              <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700/50">
                <p className="text-xs text-gray-500 mb-1">Day High</p>
                {isLoading ? <div className="h-5 w-16 bg-gray-700/50 rounded animate-pulse" /> : <p className="text-white font-medium">{formatINR(dayHigh)}</p>}
              </div>

              <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700/50">
                <p className="text-xs text-gray-500 mb-1">Day Low</p>
                {isLoading ? <div className="h-5 w-16 bg-gray-700/50 rounded animate-pulse" /> : <p className="text-white font-medium">{formatINR(dayLow)}</p>}
              </div>

              <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700/50">
                <p className="text-xs text-gray-500 mb-1">Prev. Close</p>
                {isLoading ? <div className="h-5 w-16 bg-gray-700/50 rounded animate-pulse" /> : <p className="text-white font-medium">{formatINR(prevClose)}</p>}
              </div>

              <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700/50">
                <p className="text-xs text-gray-500 mb-1">Volume</p>
                {isLoading ? <div className="h-5 w-16 bg-gray-700/50 rounded animate-pulse" /> : (
                  <p className="text-white font-medium">
                    {volume ? (volume / 100000).toFixed(2) + 'L' : '--'}
                  </p>
                )}
              </div>

            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}