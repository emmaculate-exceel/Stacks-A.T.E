'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Route, 
  MapPin, 
  TrendingUp, 
  CircleDollarSign, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Trash,
  ArrowLeft, 
  ArrowRight, 
  Search,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import TradeRouteMap from '../../components/TradeRouteMap'
import RouteCard from '../../components/RouteCard'
import NewRouteModal from '../../components/NewRouteModal'
import RouteDetailPanel from '../../components/RouteDetailPanel'

// Mock data for trade routes
const mockTradeRoutes = [
  {
    id: 1,
    name: "Gold Coast Route",
    start: "Lagos",
    end: "Accra",
    distance: 430,
    profit: 2580,
    risk: "Low",
    duration: 3,
    resources: ["Gold", "Silk", "Spices"],
    status: "active",
    lastTraded: "2 hours ago",
    description: "A lucrative coastal route connecting major trading ports with minimal risk.",
    merchants: 3,
    completedTrades: 28,
    successRate: 94
  },
  {
    id: 2,
    name: "Trans-Saharan Path",
    start: "Marrakech",
    end: "Timbuktu",
    distance: 1670,
    profit: 4850,
    risk: "High",
    duration: 14,
    resources: ["Salt", "Gold", "Ivory"],
    status: "active",
    lastTraded: "1 day ago",
    description: "A dangerous but profitable route across the Sahara Desert. Only for the most experienced merchants.",
    merchants: 2,
    completedTrades: 12,
    successRate: 67
  },
  {
    id: 3,
    name: "Swahili Spice Line",
    start: "Mombasa",
    end: "Zanzibar",
    distance: 320,
    profit: 1950,
    risk: "Medium",
    duration: 2,
    resources: ["Spices", "Textiles", "Pottery"],
    status: "inactive",
    lastTraded: "5 days ago",
    description: "Connect with the rich trading networks of the Swahili Coast.",
    merchants: 0,
    completedTrades: 15,
    successRate: 82
  },
  {
    id: 4,
    name: "Ivory Road",
    start: "Cairo",
    end: "Khartoum",
    distance: 1730,
    profit: 3620,
    risk: "Medium",
    duration: 10,
    resources: ["Ivory", "Gold", "Textiles"],
    status: "active",
    lastTraded: "3 hours ago",
    description: "Follow the Nile south to trade valuable ivory and gold.",
    merchants: 4,
    completedTrades: 32,
    successRate: 91
  },
  {
    id: 5,
    name: "Cape Commerce Line",
    start: "Cape Town",
    end: "Port Elizabeth",
    distance: 770,
    profit: 1820,
    risk: "Low",
    duration: 5,
    resources: ["Diamonds", "Wine", "Wool"],
    status: "active",
    lastTraded: "12 hours ago",
    description: "A safe coastal route along the southernmost tip of Africa.",
    merchants: 2,
    completedTrades: 18,
    successRate: 100
  }
];

export default function TradeRoutes() {
  const { user } = useAuth()
  const router = useRouter()
  const [routes, setRoutes] = useState(mockTradeRoutes)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [showNewRouteModal, setShowNewRouteModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  
  // Route stats
  const activeRoutes = routes.filter(route => route.status === 'active').length
  const totalProfit = routes.reduce((sum, route) => sum + route.profit, 0)
  const avgSuccessRate = Math.round(
    routes.reduce((sum, route) => sum + route.successRate, 0) / routes.length
  )

//   useEffect(() => {
//     if (!user.loggedIn) {
//       router.push('/')
//     }
//   }, [user, router])

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.start.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.end.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || route.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleDeleteRoute = (id) => {
    setRoutes(routes.filter(route => route.id !== id));
    if (selectedRoute && selectedRoute.id === id) {
      setSelectedRoute(null);
    }
  };

  const handleToggleRouteStatus = (id) => {
    setRoutes(routes.map(route => {
      if (route.id === id) {
        const newStatus = route.status === 'active' ? 'inactive' : 'active';
        return { ...route, status: newStatus };
      }
      return route;
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-wrap justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Trade Routes
            </h1>
            <p className="text-gray-400 mt-1">
              Establish and manage your trading network across Africa
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewRouteModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg font-semibold text-white flex items-center gap-2 mt-4 sm:mt-0"
          >
            <Plus className="w-4 h-4" />
            Create New Route
          </motion.button>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 hover:border-yellow-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
                <Route className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-gray-300 font-medium">Active Routes</h3>
            </div>
            <p className="text-2xl font-bold text-white">{activeRoutes} <span className="text-sm text-gray-400">/ {routes.length}</span></p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 hover:border-yellow-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
                <CircleDollarSign className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-gray-300 font-medium">Total Profits</h3>
            </div>
            <p className="text-2xl font-bold text-white">{totalProfit.toLocaleString()} <span className="text-sm text-gray-400">FLOW</span></p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 hover:border-yellow-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-gray-300 font-medium">Success Rate</h3>
            </div>
            <p className="text-2xl font-bold text-white">{avgSuccessRate}%</p>
          </motion.div>
        </motion.div>

        {/* Map Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-bold text-white">Routes Map</h2>
            <p className="text-gray-400 text-sm">Visualize your trading network across Africa</p>
          </div>
          <div className="h-80 bg-gray-700/30 relative">
            <TradeRouteMap routes={routes} selectedRouteId={selectedRoute?.id} onSelectRoute={(route) => setSelectedRoute(route)} />
          </div>
        </motion.div>

        {/* Routes List & Details Panel */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column: Search and list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:w-3/5"
          >
            {/* Search & Filter */}
            <div className="mb-4 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search routes by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none transition-all duration-300"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-800/50 border border-gray-700/50 rounded-lg text-white px-4 py-3 focus:border-yellow-500/50 focus:outline-none transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Routes List */}
            <div className="space-y-4 mb-6">
              <AnimatePresence>
                {filteredRoutes.length > 0 ? (
                  filteredRoutes.map((route) => (
                    <RouteCard
                      key={route.id}
                      route={route}
                      isSelected={selectedRoute?.id === route.id}
                      onSelect={() => setSelectedRoute(route)}
                      onDelete={() => handleDeleteRoute(route.id)}
                      onToggleStatus={() => handleToggleRouteStatus(route.id)}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-gray-800/30 rounded-lg p-6 text-center"
                  >
                    <p className="text-gray-400">No trade routes match your search criteria.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Links */}
            <div className="flex justify-between mt-8">
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </motion.div>
              </Link>
              <Link href="/marketplace">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-gray-400 hover:text-white"
                >
                  Visit Marketplace
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* Right column: Selected route details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:w-2/5"
          >
            <AnimatePresence mode="wait">
              {selectedRoute ? (
                <RouteDetailPanel 
                  key={selectedRoute.id}
                  route={selectedRoute} 
                  onClose={() => setSelectedRoute(null)}
                  onDelete={() => handleDeleteRoute(selectedRoute.id)}
                  onToggleStatus={() => handleToggleRouteStatus(selectedRoute.id)}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 h-full flex flex-col items-center justify-center text-center"
                >
                  <Route className="w-16 h-16 text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Route Selected</h3>
                  <p className="text-gray-400 mb-6">Select a trade route from the list to view details</p>
                  <button
                    onClick={() => setShowNewRouteModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-yellow-500/30 to-orange-600/30 hover:from-yellow-500 hover:to-orange-600 rounded-lg font-semibold text-white flex items-center gap-2 transition-all duration-300"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Route
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* New Route Modal */}
      <AnimatePresence>
        {showNewRouteModal && (
          <NewRouteModal 
            onClose={() => setShowNewRouteModal(false)}
            onCreateRoute={(newRoute) => {
              const route = {
                id: routes.length + 1,
                ...newRoute,
                status: 'active',
                lastTraded: 'Just now',
                merchants: 0,
                completedTrades: 0,
                successRate: 0
              };
              setRoutes([...routes, route]);
              setShowNewRouteModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}