'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsRight, ChevronsLeft, TrendingUp, Gamepad2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

import NFTTradingGame from '../../components/games/NFTTradingGame';
import CaravanRoutesGame from '@/components/games/CaravanRoutesGames';

export default function Play() {
  const { user } = useAuth();
  const [selectedGame, setSelectedGame] = useState(null);
  
  const games = [
    {
      id: 'caravan',
      name: 'Crypto Caravan',
      description: 'Trade crypto assets across global markets to build your empire',
      icon: <TrendingUp className="w-8 h-8 text-amber-400" />,
      component: <CaravanRoutesGame />,
      gradient: 'from-amber-500 via-orange-500 to-yellow-500',
      lightGradient: 'from-amber-500/10 via-orange-500/10 to-yellow-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      id: 'nft',
      name: 'NFT Trader Pro',
      description: 'Discover and collect rare NFTs to climb the leaderboard',
      icon: <Gamepad2 className="w-8 h-8 text-purple-400" />,
      component: <NFTTradingGame />,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      lightGradient: 'from-purple-500/10 via-pink-500/10 to-rose-500/10',
      borderColor: 'border-purple-500/20'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {selectedGame === null ? (
            <motion.div
              key="game-selection"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              variants={containerVariants}
              className="text-center"
            >
              <motion.h1 
                className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
                variants={itemVariants}
              >
                Choose Your Game
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 max-w-2xl mx-auto mb-12"
                variants={itemVariants}
              >
                Build your empire through strategic trading or collect rare NFTs
              </motion.p>

              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
              >
                {games.map((game) => (
                  <motion.div 
                    key={game.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button 
                      onClick={() => setSelectedGame(game.id)}
                      className="w-full h-full text-left"
                    >
                      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${game.lightGradient} p-8 transition-all duration-300 border ${game.borderColor} h-full`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 -z-10" />
                        <div className={`p-4 rounded-xl bg-gradient-to-br ${game.gradient} inline-block mb-6`}>
                          {game.icon}
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">{game.name}</h2>
                        <p className="text-gray-300">{game.description}</p>
                        
                        <div className="mt-6 flex items-center text-gray-300 group">
                          <span>Play now</span>
                          <ChevronsRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="game-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-6">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <ChevronsLeft className="w-5 h-5 mr-1" />
                  <span>Back to Games</span>
                </button>
              </div>
              
              {games.find(game => game.id === selectedGame)?.component}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
      </div>
    </div>
  );
}