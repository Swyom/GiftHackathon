import React from 'react';
import { motion } from 'framer-motion';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

function TopStocks() {
  const topStock = {
    name: 'Tesla Inc',
    symbol: 'TSLA',
    price: 29.34,
    currentValue: 177.90,
    change: 17.63,
    high: 11691.89,
    preClose: 11512.41,
    low: 11470.47,
    open: 11690.11
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Top Stock</h2>
        <span className="text-xs text-gray-400">Most Active</span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white font-semibold">{topStock.name}</span>
            <span className="ml-2 text-sm text-gray-400">{topStock.symbol}</span>
          </div>
          <div className="flex items-center text-green-400">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            <span>+{topStock.change}</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-white mt-2">${topStock.currentValue}</p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">High</span>
          <span className="text-white">${topStock.high.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Pre Close</span>
          <span className="text-white">${topStock.preClose.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Low</span>
          <span className="text-white">${topStock.low.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Open</span>
          <span className="text-white">${topStock.open.toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default TopStocks;