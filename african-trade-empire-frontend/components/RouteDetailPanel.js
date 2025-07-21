'use client'

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  CircleDollarSign, 
  ShieldCheck, 
  Package, 
  Users, 
  TrendingUp, 
  Power, 
  Trash, 
  X, 
  ChevronRight
} from 'lucide-react';

const RouteDetailPanel = ({ route, onClose, onDelete, onToggleStatus }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Determine risk color
  const getRiskColor = (risk) => {
    switch(risk.toLowerCase()) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };
  
  const getRiskBg = (risk) => {
    switch(risk.toLowerCase()) {
      case 'low': return 'bg-green-500/20';
      case 'medium': return 'bg-yellow-500/20';
      case 'high': return 'bg-red-500/20';
      default: return 'bg-gray-700/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden h-full flex flex-col"
    >
      {/* Header with close button */}
      <div className="p-6 border-b border-gray-700/50 flex justify-between items-center bg-gradient-to-r from-gray-800/80 to-gray-700/80">
        <h2 className="text-xl font-bold text-white">Route Details</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="p-1.5 rounded-full bg-gray-700/50 text-gray-400 hover:bg-gray-700/70"
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
      
      {/* Route Name Banner */}
      <div className="p-5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-yellow-500/30">
        <h1 className="text-2xl font-bold text-yellow-400">{route.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-white">
            {route.start} <ChevronRight className="w-3 h-3 inline mx-1" /> {route.end}
          </span>
          <div className={`ml-auto px-2 py-0.5 rounded-full text-xs font-medium ${
            route.status === 'active' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-gray-700/30 text-gray-400 border border-gray-600/30'
          }`}>
            {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700/50">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'overview' 
              ? 'border-yellow-500 text-yellow-400' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'resources' 
              ? 'border-yellow-500 text-yellow-400' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Resources
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'stats' 
              ? 'border-yellow-500 text-yellow-400' 
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Stats
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="flex-grow overflow-y-auto p-5">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-gray-300 mb-5">{route.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-gray-800/70 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/20">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-medium text-white">Duration</h3>
                </div>
                <p className="text-xl font-bold text-white">{route.duration} {route.duration === 1 ? 'day' : 'days'}</p>
              </div>
              
              <div className="bg-gray-800/70 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20">
                    <CircleDollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-sm font-medium text-white">Profit</h3>
                </div>
                <p className="text-xl font-bold text-white">{route.profit.toLocaleString()} <span className="text-xs text-gray-400">FLOW</span></p>
              </div>
              
              <div className="bg-gray-800/70 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${getRiskBg(route.risk)}`}>
                    <ShieldCheck className={`w-4 h-4 ${getRiskColor(route.risk)}`} />
                  </div>
                  <h3 className="text-sm font-medium text-white">Risk Level</h3>
                </div>
                <p className={`text-xl font-bold ${getRiskColor(route.risk)}`}>{route.risk}</p>
              </div>
              
              <div className="bg-gray-800/70 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/20">
                    <MapPin className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-sm font-medium text-white">Distance</h3>
                </div>
                <p className="text-xl font-bold text-white">{route.distance.toLocaleString()} <span className="text-xs text-gray-400">km</span></p>
              </div>
            </div>
            
            <div className="bg-gray-800/70 rounded-lg p-4 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-indigo-500/20">
                  <Clock className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="text-sm font-medium text-white">Activity Timeline</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5"></div>
                  <div>
                    <p className="text-sm font-medium text-white">Last traded {route.lastTraded}</p>
                    <p className="text-xs text-gray-400">Merchant completed journey</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-500 mt-1.5"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">Route established</p>
                    <p className="text-xs text-gray-400">Initial trading path mapped</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'resources' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h3 className="text-white font-medium mb-4">Tradeable Resources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {route.resources.map((resource, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800/70 rounded-lg p-4 border border-gray-700/50 flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                    <Package className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{resource}</h4>
                    <p className="text-xs text-gray-400">High demand</p>
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="text-white font-medium mb-4">Resource Requirements</h3>
            <div className="bg-gray-800/70 rounded-lg p-4 border border-gray-700/50">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-300">Merchants must be level 2 or higher</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-300">Caravan of at least 3 merchants recommended</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-300">{route.risk !== 'Low' ? 'Guards recommended for protection' : 'Safe passage, no guards required'}</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="bg-gray-800/70 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-blue-500/20">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-white">Merchants</h3>
              </div>
              <p className="text-2xl font-bold text-white">{route.merchants}</p>
              <p className="text-xs text-gray-400 mt-1">Active merchants on this route</p>
            </div>
            
            <div className="bg-gray-800/70 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/20">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-sm font-medium text-white">Completed Trades</h3>
              </div>
              <p className="text-2xl font-bold text-white">{route.completedTrades}</p>
              <p className="text-xs text-gray-400 mt-1">Total completed journeys</p>
            </div>
            
            <div className="bg-gray-800/70 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-purple-500/20">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-sm font-medium text-white">Success Rate</h3>
              </div>
              <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full rounded-full ${
                    route.successRate > 80 ? 'bg-green-500' 
                    : route.successRate > 50 ? 'bg-yellow-500' 
                    : 'bg-red-500'
                  }`}
                  style={{ width: `${route.successRate}%` }}
                ></div>
              </div>
              <div className="flex justify-between">
                <p className="text-sm font-bold text-white">{route.successRate}%</p>
                <p className="text-xs text-gray-400">Target: 90%</p>
              </div>
            </div>
            
            <div className="bg-gray-800/70 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-3">Historical Performance</h3>
              <div className="h-32 flex items-end gap-1">
                {[65, 72, 68, 85, 78, 92, 88, 94, 90, 95, 92, 96].map((value, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      style={{ height: `${value}%` }} 
                      className={`w-full rounded-sm ${
                        value > 80 ? 'bg-green-500/60' 
                        : value > 50 ? 'bg-yellow-500/60' 
                        : 'bg-red-500/60'
                      }`}
                    ></div>
                    <span className="text-gray-500 text-xs mt-1">{i+1}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">Last 12 months performance</p>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Action Footer */}
      <div className="p-4 border-t border-gray-700/50 bg-gray-800/50 flex justify-between">
        <button
          onClick={onDelete}
          className="px-4 py-2 rounded-lg text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors flex items-center gap-2"
        >
          <Trash className="w-4 h-4" />
          Delete Route
        </button>
        
        <button
          onClick={onToggleStatus}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            route.status === 'active'
              ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-600'
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          <Power className="w-4 h-4" />
          {route.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </motion.div>
  );
};

export default RouteDetailPanel;