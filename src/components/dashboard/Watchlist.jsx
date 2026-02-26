import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import { PlusIcon } from '@heroicons/react/24/outline';

function Watchlist() {
  const watchlistItems = [
    { name: 'Amazon.com, Inc.', symbol: 'AMZN', value: 15000, change: 2.3, isPositive: true },
    { name: 'Coca-Cola Co', symbol: 'KO', value: 12000, change: -0.5, isPositive: false },
    { name: 'Bayerische Motoren Werke AG', symbol: 'BMW', value: 9000, change: 1.2, isPositive: true },
    { name: 'Microsoft Corp', symbol: 'MSFT', value: 6000, change: 0.8, isPositive: true },
    { name: 'United Parcel Service, Inc.', symbol: 'UPS', value: 3000, change: -0.3, isPositive: false },
    { name: 'Mastercard Inc', symbol: 'MA', value: 0, change: 0, isPositive: true }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gray-800/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Watchlist</h2>
        <button className="p-1 hover:bg-white/5 rounded-lg transition-colors">
          <PlusIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="space-y-3">
        {watchlistItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-2 hover:bg-gray-700/30 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-3">
              <StarIcon className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-white text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-400">{item.symbol}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white text-sm font-medium">${item.value.toLocaleString()}</p>
              {item.value > 0 && (
                <p className={`text-xs ${item.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {item.isPositive ? '+' : ''}{item.change}%
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Watchlist;