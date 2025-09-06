'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { User, Wallet, Trophy, Star, Settings, LogOut } from 'lucide-react'
import Image from 'next/image'

interface UserStats {
  totalTrades: number;
  totalProfit: number;
  nftCount: number;
  reputation: number;
}

export default function Profile() {
  const { user, stacksUser, isLoading, disconnectWallet } = useAuth()
  const router = useRouter()
  const [userStats, setUserStats] = useState<UserStats>({
    totalTrades: 0,
    totalProfit: 0,
    nftCount: 0,
    reputation: 0
  })

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !user.loggedIn && !stacksUser) {
      router.push('/')
    }
  }, [user, stacksUser, isLoading, router])

  useEffect(() => {
    // Simulate fetching user stats
    setUserStats({
      totalTrades: 127,
      totalProfit: 2.45,
      nftCount: 23,
      reputation: 4.8
    })
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user.loggedIn && !stacksUser) {
    return null
  }

  const getDisplayAddress = (): string => {
    if (user.loggedIn && user.addr) {
      return user.addr
    } else if (stacksUser) {
      return stacksUser.profile.stxAddress.mainnet || stacksUser.profile.stxAddress.testnet
    }
    return ''
  }

  const getUserName = (): string => {
    if (stacksUser && stacksUser.profile.name) {
      return stacksUser.profile.name
    }
    return 'Anonymous Trader'
  }

  const getProfileImage = (): string => {
    if (stacksUser && stacksUser.profile.image && stacksUser.profile.image[0]) {
      return stacksUser.profile.image[0].contentUrl
    }
    return '/appIcon.jpg'
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700"
        >
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="relative">
              <Image
                src={getProfileImage()}
                alt="Profile"
                width={120}
                height={120}
                className="w-30 h-30 rounded-full border-4 border-purple-500"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{getUserName()}</h1>
              <p className="text-gray-400 mb-4 break-all">
                {getDisplayAddress().substring(0, 20)}...{getDisplayAddress().substring(getDisplayAddress().length - 8)}
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(userStats.reputation) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-600'
                    }`}
                  />
                ))}
                <span className="text-gray-400 ml-2">{userStats.reputation}/5.0</span>
              </div>

              <div className="flex gap-4">
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </button>
                <button 
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-6 rounded-xl border border-blue-500/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-6 h-6 text-blue-400" />
                <span className="text-blue-400 font-medium">Total Trades</span>
              </div>
              <p className="text-2xl font-bold">{userStats.totalTrades}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-600/20 to-green-800/20 p-6 rounded-xl border border-green-500/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-6 h-6 text-green-400" />
                <span className="text-green-400 font-medium">Total Profit</span>
              </div>
              <p className="text-2xl font-bold">{userStats.totalProfit} STX</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-6 rounded-xl border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6 text-purple-400" />
                <span className="text-purple-400 font-medium">NFTs Owned</span>
              </div>
              <p className="text-2xl font-bold">{userStats.nftCount}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 p-6 rounded-xl border border-yellow-500/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <User className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Reputation</span>
              </div>
              <p className="text-2xl font-bold">{userStats.reputation}/5.0</p>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: 'Purchased Merchant NFT #127', time: '2 hours ago', type: 'purchase' },
                { action: 'Completed trade route to Cairo', time: '5 hours ago', type: 'trade' },
                { action: 'Sold Spice Merchant #89', time: '1 day ago', type: 'sale' },
                { action: 'Established new trade route', time: '2 days ago', type: 'route' }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'purchase' ? 'bg-blue-500' :
                    activity.type === 'trade' ? 'bg-green-500' :
                    activity.type === 'sale' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-white">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
