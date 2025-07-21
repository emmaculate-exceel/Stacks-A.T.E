'use client'

import { motion } from 'framer-motion';
import { MapPin, Clock, CircleDollarSign, ShieldCheck, Power, Trash } from 'lucide-react';

const RouteCard = ({ route, isSelected, onSelect, onDelete, onToggleStatus }) => {
  // Determine risk color
  const getRiskColor = (risk) => {
    switch(risk.toLowerCase()) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };
  
  // Stop event propagation for button clicks
  const handleButtonClick = (e, callback) => {
    e.stopPropagation();
    callback();
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      onClick={onSelect}
      className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
        isSelected 
          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50' 
          : 'bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50'
      }`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className={`font-bold text-lg ${isSelected ? 'text-yellow-400' : 'text-white'}`}>
            {route.name}
          </h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            route.status === 'active' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-gray-700/30 text-gray-400 border border-gray-600/30'
          }`}>
            {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
          </div>
        </div>
        
        <div className="flex gap-4 mb-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <MapPin className="w-4 h-4 text-gray-500" />
            {route.start} → {route.end}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-400">
            <Clock className="w-4 h-4 text-gray-500" />
            {route.duration} {route.duration === 1 ? 'day' : 'days'}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-gray-800/70 rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-1">Distance</p>
            <p className="text-sm font-medium text-white">{route.distance} km</p>
          </div>
          <div className="bg-gray-800/70 rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-1">Profit</p>
            <div className="flex items-center">
              <CircleDollarSign className="w-3 h-3 text-yellow-500 mr-1" />
              <p className="text-sm font-medium text-white">{route.profit}</p>
            </div>
          </div>
          <div className="bg-gray-800/70 rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-1">Risk</p>
            <p className={`text-sm font-medium ${getRiskColor(route.risk)}`}>{route.risk}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            Last traded: {route.lastTraded}
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleButtonClick(e, onToggleStatus)}
              className={`p-1.5 rounded-full ${
                route.status === 'active'
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <Power className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleButtonClick(e, onDelete)}
              className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              <Trash className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RouteCard;