// app/dashboard/page.js
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { CircleDollarSign, TrendingUp, Users, Activity, ArrowUp, ArrowDown } from 'lucide-react'

export default function Dashboard() {
 const { user } = useAuth()
 const router = useRouter()

//  useEffect(() => {
//    if (!user.loggedIn) {
//      router.push('/')
//    }
//  }, [user, router])

 const stats = [
   {
     title: "Total Trade Value",
     value: "245,678",
     currency: "FLOW",
     change: "+12.5%",
     trend: "up",
     icon: CircleDollarSign,
     gradient: "from-emerald-500 to-teal-500"
   },
   {
     title: "Active Trade Routes",
     value: "24",
     currency: "Routes",
     change: "+3",
     trend: "up",
     icon: TrendingUp,
     gradient: "from-blue-500 to-indigo-500"
   },
   {
     title: "Trading Partners",
     value: "156",
     currency: "Partners",
     change: "+8",
     trend: "up",
     icon: Users,
     gradient: "from-purple-500 to-pink-500"
   },
   {
     title: "Success Rate",
     value: "94.2%",
     currency: "",
     change: "-2.3%",
     trend: "down",
     icon: Activity,
     gradient: "from-amber-500 to-orange-500"
   }
 ]

 const recentTrades = [
   {
     name: "Gold Trade Route",
     type: "Resource Trade",
     time: "2 hours ago",
     amount: "+1,234",
     status: "completed",
     route: "Lagos → Cairo"
   },
   {
     name: "Silk Route",
     type: "Merchant Trade",
     time: "5 hours ago",
     amount: "+2,567",
     status: "completed",
     route: "Timbuktu → Zanzibar"
   },
   {
     name: "Spice Trade",
     type: "Resource Trade",
     time: "8 hours ago",
     amount: "-890",
     status: "failed",
     route: "Mombasa → Cape Town"
   }
 ]

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
           Command Center
         </h1>
         <p className="text-gray-400 mt-1">
           Welcome back, Merchant {user.addr?.slice(0, 6)}
         </p>
       </motion.div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         {stats.map((stat, index) => (
           <motion.div
             key={stat.title}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: index * 0.1 }}
             className="relative overflow-hidden bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 hover:border-gray-600/50 transition-all duration-300"
           >
             <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50 z-0" />
             <div className="relative z-10">
               <div className="flex items-center justify-between mb-4">
                 <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                   <stat.icon className="w-6 h-6 text-white" />
                 </div>
                 <div className={`flex items-center gap-1 text-sm font-medium ${
                   stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                 }`}>
                   {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                   {stat.change}
                 </div>
               </div>
               <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
               <p className="text-2xl font-bold text-white mt-1">
                 {stat.value}
                 {stat.currency && <span className="text-sm text-gray-400 ml-1">{stat.currency}</span>}
               </p>
             </div>
           </motion.div>
         ))}
       </div>

       {/* Recent Trades */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.4 }}
         className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 mb-8"
       >
         <h2 className="text-xl font-bold text-white mb-6">Recent Trades</h2>
         <div className="space-y-4">
           {recentTrades.map((trade, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.5 + (index * 0.1) }}
               className="flex items-center justify-between p-4 bg-gray-700/20 rounded-lg hover:bg-gray-700/30 transition-all duration-300"
             >
               <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center
                   ${trade.status === 'completed' ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'}`}>
                   <TrendingUp className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <h3 className="font-medium text-white">{trade.name}</h3>
                   <p className="text-sm text-gray-400">{trade.route}</p>
                   <p className="text-xs text-gray-500">{trade.time}</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className={`font-medium ${
                   trade.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
                 }`}>
                   {trade.amount} FLOW
                 </p>
                 <p className={`text-sm ${
                   trade.status === 'completed' ? 'text-green-400' : 'text-red-400'
                 }`}>
                   {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                 </p>
               </div>
             </motion.div>
           ))}
         </div>
       </motion.div>

       {/* Active Routes Map */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.6 }}
         className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6"
       >
         <h2 className="text-xl font-bold text-white mb-4">Active Trade Routes</h2>
         <div className="w-full h-96 bg-gray-700/20 rounded-lg flex items-center justify-center">
           <p className="text-gray-400">Interactive Trade Routes Map Coming Soon</p>
         </div>
       </motion.div>
     </div>
   </div>
 )
}