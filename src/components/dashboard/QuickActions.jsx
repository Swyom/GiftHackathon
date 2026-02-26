import React from 'react';
import { motion } from 'framer-motion';
import {
  PresentationChartLineIcon,
  WalletIcon,
  ArrowPathIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

function QuickActions() {
  const actions = [
    { name: 'Trade', icon: ArrowPathIcon, path: '/trading', color: 'from-green-500 to-emerald-500' },
    { name: 'Portfolio', icon: WalletIcon, path: '/portfolio', color: 'from-blue-500 to-cyan-500' },
    { name: 'Market', icon: PresentationChartLineIcon, path: '/market', color: 'from-purple-500 to-pink-500' },
    { name: 'Research', icon: NewspaperIcon, path: '/research', color: 'from-orange-500 to-red-500' },
    { name: 'AI Chat', icon: ChatBubbleLeftRightIcon, path: '/chat', color: 'from-indigo-500 to-purple-500' },
    { name: 'Learn', icon: BookOpenIcon, path: '/learning', color: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-6"
    >
      {actions.map((action, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`bg-gradient-to-r ${action.color} p-4 rounded-xl text-white text-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 w-full`}
          onClick={() => alert(`Navigate to ${action.path}`)}
        >
          <action.icon className="w-6 h-6 mx-auto mb-2" />
          <span className="text-xs font-medium">{action.name}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

export default QuickActions;