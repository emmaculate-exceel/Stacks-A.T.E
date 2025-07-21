'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Tag, ArrowUpDown, PlusCircle, Search, Filter,
  Brain, TrendingUp, TrendingDown, AlertCircle,
  DollarSign, Activity, ChevronDown, Clock,
  Wallet, Heart, Share2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

// NFT Card Component
const NFTCard = ({ nft, onSelect, isSelected }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-gray-800/50 rounded-xl overflow-hidden border ${
        isSelected ? 'border-purple-500' : 'border-gray-700/50'
      } transition-all duration-300 hover:border-purple-500/50`}
    >
      <div className="relative">
        <img 
          src={nft.image} 
          alt={nft.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="p-2 bg-gray-900/80 rounded-full hover:bg-gray-800"
          >
            <Heart 
              className={`w-4 h-4 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`}
            />
          </button>
          <button className="p-2 bg-gray-900/80 rounded-full hover:bg-gray-800">
            <Share2 className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 bg-gray-900/80 rounded-full text-xs text-white">
            {nft.type}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-white">{nft.name}</h3>
            <p className="text-sm text-gray-400">{nft.collection}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Price</p>
            <p className="font-bold text-white">{nft.price} STX</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">{nft.timeLeft}</span>
          </div>
          <button
            onClick={() => onSelect(nft)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm font-medium text-white transition-colors duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Filter Bar Component
const FilterBar = ({ onFilterChange }) => {
  const filters = [
    { label: 'All Items', value: 'all' },
    { label: 'Merchants', value: 'merchants' },
    { label: 'Trade Routes', value: 'routes' },
    { label: 'Resources', value: 'resources' },
  ];

  const sorts = [
    { label: 'Recently Listed', value: 'recent' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Most Viewed', value: 'views' },
  ];

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/50">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search NFTs..."
              className="pl-10 pr-4 py-2 bg-gray-900 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                className="px-4 py-2 bg-gray-900 rounded-lg text-sm text-white hover:bg-gray-700 transition-colors duration-300"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <select className="appearance-none px-4 py-2 pr-10 bg-gray-900 rounded-lg text-sm text-white hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500">
              {sorts.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          
          <button className="p-2 bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <Filter className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Stats Bar Component
const StatsBar = () => {
  const stats = [
    { label: 'Floor Price', value: '125 FLOW' },
    { label: 'Total Volume', value: '1.2M FLOW' },
    { label: 'Items', value: '10,547' },
    { label: 'Owners', value: '3,204' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <p className="text-sm text-gray-400">{stat.label}</p>
          <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

// Main Marketplace Component
const Marketplace = () => {
  const { user } = useAuth();
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [nfts, setNfts] = useState([
    {
      id: 1,
      name: 'Desert Caravan Leader',
      collection: 'Merchant Lords',
      type: 'Merchant',
      price: 150,
      timeLeft: '3h 24m',
      image: '/extra.jpg'
    },
    {
      id: 2,
      name: 'Silk Road Junction',
      collection: 'Trade Routes',
      type: 'Route',
      price: 275,
      timeLeft: '1d 12h',
      image: '/002.jpeg'
    },
    {
      id: 3,
      name: 'Golden Sahara Compass',
      collection: 'Navigation Tools',
      type: 'Artifact',
      price: 425,
      timeLeft: '6h 15m',
      image: '/003.jpeg'
    },
    {
      id: 4,
      name: 'Timbuktu Market Pass',
      collection: 'Merchant Lords',
      type: 'Merchant',
      price: 180,
      timeLeft: '2d 8h',
      image: '/004.jpeg'
    },
    {
      id: 5,
      name: 'Zanzibar Spice Trader',
      collection: 'Merchant Lords',
      type: 'Merchant',
      price: 320,
      timeLeft: '4h 45m',
      image: '/000.jpg'
    },
    {
      id: 6,
      name: 'Atlas of Ancient Routes',
      collection: 'Navigation Tools',
      type: 'Artifact',
      price: 550,
      timeLeft: '12h 30m',
      image: '/006.jpeg'
    },
    {
      id: 7,
      name: 'Great Lakes Network',
      collection: 'Trade Routes',
      type: 'Route',
      price: 410,
      timeLeft: '1d 4h',
      image: '/005.jpeg'
    },
    {
      id: 8,
      name: 'Swahili Coast Merchant',
      collection: 'Merchant Lords',
      type: 'Merchant',
      price: 290,
      timeLeft: '5h 20m',
      image: '/007.jpeg'
    },
    {
      id: 9,
      name: 'Gold Weight Set',
      collection: 'Trade Tools',
      type: 'Artifact',
      price: 175,
      timeLeft: '9h 15m',
      image: '/008.jpeg'
    },
    {
      id: 10,
      name: 'Sahel Trade Route',
      collection: 'Trade Routes',
      type: 'Route',
      price: 340,
      timeLeft: '2d 1h',
      image: '/009.jpg'
    },
    {
      id: 11,
      name: 'Royal Merchant Pass',
      collection: 'Merchant Lords',
      type: 'Merchant',
      price: 890,
      timeLeft: '1d 7h',
      image: '/010.jpg'
    },
    {
      id: 12,
      name: 'Ancient Ivory Compass',
      collection: 'Navigation Tools',
      type: 'Artifact',
      price: 720,
      timeLeft: '8h 40m',
      image: '/011.jpg'
    },
    {
      id: 13,
      name: 'Cape Route Network',
      collection: 'Trade Routes',
      type: 'Route',
      price: 460,
      timeLeft: '3d 5h',
      image: '/012.jpeg'
    },
    {
      id: 14,
      name: 'Master Trader Scroll',
      collection: 'Trade Tools',
      type: 'Artifact',
      price: 380,
      timeLeft: '1d 9h',
      image: '/013.jpg'
    },
    {
      id: 15,
      name: 'Desert Oracle',
      collection: 'Merchant Lords',
      type: 'Merchant',
      price: 950,
      timeLeft: '5d 12h',
      image: '/014.webp'
    },
    {
      id: 16,
      name: 'Red Sea Route',
      collection: 'Trade Routes',
      type: 'Route',
      price: 580,
      timeLeft: '2d 6h',
      image: '/015.jpg'
    },
    {
      id: 17,
      name: 'Merchant\'s Ledger',
      collection: 'Trade Tools',
      type: 'Artifact',
      price: 240,
      timeLeft: '1d 3h',
      image: '/016.avif'
    },
    {
      id: 18,
      name: 'Kalahari Guide',
      collection: 'Merchant Lords',
      type: 'Merchant',
      price: 310,
      timeLeft: '6h 55m',
      image: '/017.jpeg'
    },
    {
      id: 19,
      name: 'Ethiopian Highland Path',
      collection: 'Trade Routes',
      type: 'Route',
      price: 420,
      timeLeft: '4d 8h',
      image: '/018.webp'
    },
    {
      id: 20,
      name: 'Trade Wind Compass',
      collection: 'Navigation Tools',
      type: 'Artifact',
      price: 680,
      timeLeft: '2d 4h',
      image: '/019.webp'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            NFT Marketplace
          </h1>
          <p className="text-gray-400 mt-1">
            Discover, trade, and collect unique African trade assets
          </p>
        </motion.div>

        {/* Stats Overview */}
        <StatsBar />

        {/* Filters and Search */}
        <FilterBar />

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* NFT Grid */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  onSelect={setSelectedNFT}
                  isSelected={selectedNFT?.id === nft.id}
                />
              ))}
            </div>
          </div>

          {/* SudoCat Analysis Panel */}
          <div className="col-span-1">
            <div className="sticky top-24">
              <SudoCatAnalysis selectedNFT={selectedNFT} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// SudoCat Analysis Component (keeping your existing implementation)
const SudoCatAnalysis = ({ selectedNFT }) => {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedNFT) {
      analyzeTrade(selectedNFT);
    }
  }, [selectedNFT]);

  const analyzeTrade = async (nft) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const analysis = {
        predictedPrice: {
          low: nft.price * 0.9,
          expected: nft.price * 1.2,
          high: nft.price * 1.5
        },
        marketTrend: {
          direction: Math.random() > 0.5 ? 'up' : 'down',
          percentage: (Math.random() * 15 + 5).toFixed(2),
          volume: Math.floor(Math.random() * 1000)
        },
        recommendation: {
          action: ['buy', 'hold', 'sell'][Math.floor(Math.random() * 3)],
          reason: 'Based on market volatility and trading volume'
        },
        confidence: Math.floor(Math.random() * 20) + 80,
        riskLevel: {
          level: Math.random() > 0.5 ? 'low' : 'medium',
          factors: ['market volatility', 'trading volume', 'price stability']
        }
      };
      
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing NFT:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedNFT) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center gap-2 text-gray-400">
          <Brain className="w-5 h-5" />
          <p>Select an NFT for SudoCat analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          SudoCat AI Analysis
        </h3>
        {loading ? (
          <div className="animate-pulse text-purple-400">Processing...</div>
        ) : (
          <div className="text-green-400">Analysis Complete</div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full" />
        </div>
      ) : aiAnalysis && (
        <div className="space-y-6">
          {/* Price Prediction */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Price Prediction</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">Low</p>
                <p className="text-lg font-bold text-red-400">
                  {aiAnalysis.predictedPrice.low.toFixed(2)} FLOW
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Expected</p>
                <p className="text-lg font-bold text-green-400">
                  {aiAnalysis.predictedPrice.expected.toFixed(2)} FLOW
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">High</p>
                <p className="text-lg font-bold text-blue-400">
                  {aiAnalysis.predictedPrice.high.toFixed(2)} FLOW
                </p>
              </div>
            </div>
          </div>

          {/* Market Trend */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Market Trend</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {aiAnalysis.marketTrend.direction === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
                <span className={`text-lg font-bold ${
                  aiAnalysis.marketTrend.direction === 'up' 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {aiAnalysis.marketTrend.percentage}%
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Volume: {aiAnalysis.marketTrend.volume} FLOW
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-3">AI Recommendation</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <span className="text-lg font-bold text-white capitalize">
                  {aiAnalysis.recommendation.action}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                Confidence: {aiAnalysis.confidence}%
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {aiAnalysis.recommendation.reason}
            </p>
          </div>

          {/* Risk Assessment */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Risk Assessment</h4>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className={`w-5 h-5 ${
                aiAnalysis.riskLevel.level === 'low' 
                  ? 'text-green-400' 
                  : 'text-yellow-400'
              }`} />
              <span className="text-lg font-bold text-white capitalize">
                {aiAnalysis.riskLevel.level} Risk
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiAnalysis.riskLevel.factors.map((factor, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-400"
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-medium text-white transition-colors duration-300 flex items-center justify-center gap-2">
              <DollarSign className="w-4 h-4" />
              Buy Now
            </button>
            <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-white transition-colors duration-300 flex items-center justify-center gap-2">
              <Tag className="w-4 h-4" />
              Make Offer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;