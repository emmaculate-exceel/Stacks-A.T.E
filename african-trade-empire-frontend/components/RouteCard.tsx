'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, CircleDollarSign, ShieldCheck, Power, Trash } from 'lucide-react';

interface TradeRoute {
  id: number;
  name: string;
  start: string;
  end: string;
  distance: number;
  profit: number; // Changed from string to number
  risk: string;
  duration: number;
  resources: string[];
  status: 'active' | 'inactive';
  lastTraded: string;
  description?: string;
  merchants?: number;
  completedTrades?: number;
  successRate?: number;
}

interface RouteCardProps {
  route: TradeRoute;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

const RouteCard: React.FC<RouteCardProps> = ({ route, isSelected, onSelect, onDelete, onToggleStatus }) => {
  // Determine risk color
  const getRiskColor = (risk: string) => {
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
  const handleButtonClick = (e: React.MouseEvent, callback: () => void) => {
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
      className={`cursor-pointer rounded-lg lg:rounded-xl overflow-hidden transition-all duration-300 ${
        isSelected 
          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50' 
          : 'bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/50'
      }`}
    >
      <div className="p-3 sm:p-4 lg:p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className={`font-bold text-base sm:text-lg ${isSelected ? 'text-yellow-400' : 'text-white'} leading-tight`}>
            {route.name}
          </h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
            route.status === 'active' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-gray-700/30 text-gray-400 border border-gray-600/30'
          }`}>
            {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
          </div>
        </div>
        
        <div className="flex flex-col xs:flex-row xs:gap-4 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">{route.start} → {route.end}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
            {route.duration} {route.duration === 1 ? 'day' : 'days'}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-gray-800/70 rounded-md lg:rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-1">Distance</p>
            <p className="text-xs sm:text-sm font-medium text-white">{route.distance} km</p>
          </div>
          <div className="bg-gray-800/70 rounded-md lg:rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-1">Profit</p>
            <div className="flex items-center">
              <CircleDollarSign className="w-3 h-3 text-yellow-500 mr-1 flex-shrink-0" />
              <p className="text-xs sm:text-sm font-medium text-white truncate">{route.profit}</p>
            </div>
          </div>
          <div className="bg-gray-800/70 rounded-md lg:rounded-lg p-2">
            <p className="text-xs text-gray-500 mb-1">Risk</p>
            <p className={`text-xs sm:text-sm font-medium ${getRiskColor(route.risk)}`}>{route.risk}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 sm:mt-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 flex-shrink-0" />
            <span className="truncate">Last traded: {route.lastTraded}</span>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-2 ml-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleButtonClick(e, onToggleStatus)}
              className={`p-1 sm:p-1.5 rounded-full transition-colors ${
                route.status === 'active'
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
              }`}
              title={route.status === 'active' ? 'Deactivate Route' : 'Activate Route'}
            >
              <Power className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleButtonClick(e, onDelete)}
              className="p-1 sm:p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              title="Delete Route"
            >
              <Trash className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RouteCard;
