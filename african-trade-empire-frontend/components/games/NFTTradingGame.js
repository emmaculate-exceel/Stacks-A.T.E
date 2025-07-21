'use client'
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RefreshCcw, Gamepad, Coins } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Add necessary styles for 3D transforms
const styles = {
  perspective: {
    perspective: '1000px'
  },
  preserve3d: {
    transformStyle: 'preserve-3d'
  },
  backfaceHidden: {
    backfaceVisibility: 'hidden'
  }
};

const Card = ({ card, onSelect, isSelectable, getRarityColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={isSelectable ? { scale: 1.05 } : {}}
      style={styles.perspective}
      className="relative"
    >
      <button
        onClick={() => onSelect(card.id)}
        disabled={!isSelectable}
        className="w-full transform-gpu"
      >
        <motion.div
          className="relative w-full aspect-[3/4] rounded-xl overflow-hidden"
          style={{...styles.preserve3d}}
          animate={{ 
            rotateY: card.isFlipped ? 0 : 180
          }}
          transition={{ duration: 0.6 }}
        >
          {/* Front of card */}
          <div 
            style={{...styles.backfaceHidden}}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute inset-0 bg-gray-800 border-2 border-gray-700">
              <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(card.rarity)} opacity-10`} />
              <div className="p-4">
                <img src={card.image} alt={card.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{card.name}</h3>
                  <p className={`text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r ${getRarityColor(card.rarity)}`}>
                    {card.rarity}
                  </p>
                  <div className="bg-gray-900/50 rounded-lg p-2 mt-2">
                    <p className="text-sm text-gray-400">Trait: {card.trait}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {card.value} POWER
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back of card */}
          <div 
            style={{...styles.backfaceHidden}}
            className="absolute inset-0 w-full h-full transform rotate-y-180"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 p-6">
              <div className="absolute inset-0 bg-[url('/api/placeholder/400/400')] opacity-10" />
              <div className="h-full border-4 border-gray-300/20 rounded-lg flex items-center justify-center">
                <div className="text-6xl font-bold text-white/80 rotate-45">?</div>
              </div>
            </div>
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
};

const NFTTradingGame = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const merchants = [
    { name: "Crypto Whale", rarity: "Legendary", value: 95, trait: "Diamond Hands", image: "/api/placeholder/200/200" },
    { name: "DeFi Master", rarity: "Epic", value: 85, trait: "Yield Farmer", image: "/api/placeholder/200/200" },
    { name: "NFT Collector", rarity: "Rare", value: 75, trait: "Digital Artist", image: "/api/placeholder/200/200" },
    { name: "Blockchain Sage", rarity: "Epic", value: 80, trait: "Smart Contract Dev", image: "/api/placeholder/200/200" },
    { name: "Mining Baron", rarity: "Rare", value: 70, trait: "Hash Power", image: "/api/placeholder/200/200" },
    { name: "DAO Leader", rarity: "Legendary", value: 90, trait: "Governance Pro", image: "/api/placeholder/200/200" }
  ];

  const initializeGame = () => {
    setIsLoading(true);
    setTimeout(() => {
      const shuffledMerchants = [...merchants]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((merchant, index) => ({
          ...merchant,
          id: index,
          isFlipped: false
        }));
      setCards(shuffledMerchants);
      setSelectedCard(null);
      setGameState('playing');
      setShowResult(false);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardSelect = (cardId) => {
    if (gameState !== 'playing' || selectedCard !== null) return;

    setSelectedCard(cardId);
    const selectedCardValue = cards.find(card => card.id === cardId).value;
    const highestValue = Math.max(...cards.map(card => card.value));

    setCards(cards.map(card => ({ ...card, isFlipped: true })));
    setShowResult(true);

    if (selectedCardValue === highestValue) {
      setGameState('won');
      setScore(prev => prev + 1);
    } else {
      setGameState('lost');
      setScore(0);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Legendary': return 'from-yellow-400 via-amber-500 to-orange-600';
      case 'Epic': return 'from-purple-400 via-pink-500 to-rose-600';
      case 'Rare': return 'from-blue-400 via-indigo-500 to-violet-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block p-2 mb-4 rounded-xl bg-gray-800/50 border border-purple-500/20">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-500">
              NFT Trader Pro
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-4">
            <div className="bg-gray-800/40 rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">Score: {score}</span>
              </div>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-3 border border-purple-500/20">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-green-400" />
                <span className="text-white font-mono">Balance: {score * 100} FLOW</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onSelect={handleCardSelect}
                isSelectable={gameState === 'playing' && selectedCard === null}
                getRarityColor={getRarityColor}
              />
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center"
            >
              <div className={`inline-block px-6 py-3 rounded-xl ${
                gameState === 'won' 
                  ? 'bg-green-500/20 border border-green-500/40' 
                  : 'bg-red-500/20 border border-red-500/40'
              } mb-6`}>
                <span className={`text-2xl font-bold ${
                  gameState === 'won' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {gameState === 'won' ? '🚀 To The Moon!' : '📉 Paper Hands!'}
                </span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={initializeGame}
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium flex items-center gap-2 mx-auto disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full" />
                    Minting New Round...
                  </>
                ) : (
                  <>
                    <Gamepad className="w-4 h-4" />
                    Play Again
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default NFTTradingGame;