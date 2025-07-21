// // 




// "use client";

// import { useEffect, useRef, useState } from 'react';
// import Link from 'next/link';
// import { Compass, LayoutDashboard, Route, Wallet } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '@/context/AuthContext';
// import { useClickAway } from 'react-use';
// import * as fcl from "@onflow/fcl";

// // Reuse WalletButton component from Navbar
// const WalletButton = ({ wallet, onSelect, isLoading, loadingWallet }) => (
//   <button
//     onClick={() => onSelect(wallet.id)}
//     disabled={isLoading}
//     className={`w-full flex items-center gap-3 p-6 rounded-lg border border-white/10 transition-all duration-300
//       ${isLoading && loadingWallet === wallet.id 
//         ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse' 
//         : 'hover:bg-white/5'}`}
//   >
//     <img src={wallet.icon} alt={wallet.name} className="w-8 h-8" />
//     <div className="flex-1 text-left">
//       <div className="font-semibold text-white">{wallet.name}</div>
//       <div className="text-sm text-gray-400">Connect to {wallet.name}</div>
//     </div>
//     {isLoading && loadingWallet === wallet.id && (
//       <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
//     )}
//   </button>
// );

// export default function Home() {
//   const { user, isLoading: authLoading } = useAuth();
//   const [showWalletModal, setShowWalletModal] = useState(false);
//   const [loadingWallet, setLoadingWallet] = useState(null);
//   const modalRef = useRef(null);

//   useClickAway(modalRef, () => {
//     if (showWalletModal) setShowWalletModal(false);
//   });

//   const wallets = [
//     { id: 'flow', name: 'Flow Wallet', icon: '/flow.webp' },
//     { id: 'blocto', name: 'Blocto Wallet', icon: '/blocto.png' },
//     { id: 'dapper', name: 'Dapper Wallet', icon: '/dapper.png' }
//   ];

//   const handleWalletSelect = async (walletId) => {
//     try {
//       setLoadingWallet(walletId);
//       fcl.config().put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");
//       await fcl.authenticate();
//       setShowWalletModal(false);
//     } catch (error) {
//       console.error('Failed to connect wallet:', error);
//     } finally {
//       setLoadingWallet(null);
//     }
//   };

//   // Particle effect for background
//   useEffect(() => {
//     const canvas = document.getElementById('particles');
//     if (!(canvas instanceof HTMLCanvasElement)) return;
//     if (!canvas) return;
    
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     const particles = [];
    
//     for (let i = 0; i < 100; i++) {
//       particles.push({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         speed: 0.5 + Math.random(),
//         size: Math.random() * 2
//       });
//     }

//     function animate() {
//       ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
      
//       ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
//       particles.forEach(particle => {
//         ctx.beginPath();
//         ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
//         ctx.fill();
        
//         particle.y -= particle.speed;
//         if (particle.y < 0) {
//           particle.y = canvas.height;
//           particle.x = Math.random() * canvas.width;
//         }
//       });
      
//       requestAnimationFrame(animate);
//     }

//     animate();

//     const handleResize = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         staggerChildren: 0.2
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0
//     }
//   };

//   return (
//     <main className="min-h-screen relative overflow-hidden bg-gray-900 text-white">
//       <canvas id="particles" className="absolute inset-0 pointer-events-none" />
      
//       <div className="relative z-10">
//         <div className="max-w-7xl mx-auto px-6 py-12 mt-11">
//           <motion.div
//             initial="hidden"
//             animate="visible"
//             variants={containerVariants}
//             className="text-center mb-16"
//           >
//             <motion.h1 
//               className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500"
//               variants={itemVariants}
//             >
//               African Trade Empire
//             </motion.h1>
//             <motion.p 
//               className="text-xl text-gray-300 max-w-2xl mx-auto"
//               variants={itemVariants}
//             >
//               Build your trading empire in the heart of Africa. Trade rare NFT merchants, 
//               establish lucrative routes, and become the most powerful trader in the realm.
//             </motion.p>
//           </motion.div>

//           <motion.div 
//             variants={containerVariants}
//             className="grid grid-cols-1 md:grid-cols-3 gap-8"
//           >
//             <motion.div variants={itemVariants}>
//               <Link href="/dashboard" 
//                 className="block group">
//                 <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 transition-transform duration-300 group-hover:scale-[1.02] border border-gray-700">
//                   <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   <LayoutDashboard className="w-12 h-12 mb-4 text-amber-500" />
//                   <h2 className="text-2xl font-bold mb-2">Command Center</h2>
//                   <p className="text-gray-400">Monitor your merchant fleet and trading empire stats</p>
//                 </div>
//               </Link>
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <Link href="/marketplace" 
//                 className="block group">
//                 <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 transition-transform duration-300 group-hover:scale-[1.02] border border-gray-700">
//                   <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   <Compass className="w-12 h-12 mb-4 text-orange-500" />
//                   <h2 className="text-2xl font-bold mb-2">NFT Marketplace</h2>
//                   <p className="text-gray-400">Discover and trade unique merchant NFTs</p>
//                 </div>
//               </Link>
//             </motion.div>

//             <motion.div variants={itemVariants}>
//               <Link href="/trade" 
//                 className="block group">
//                 <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 transition-transform duration-300 group-hover:scale-[1.02] border border-gray-700">
//                   <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   <Route className="w-12 h-12 mb-4 text-yellow-500" />
//                   <h2 className="text-2xl font-bold mb-2">Trade Routes</h2>
//                   <p className="text-gray-400">Chart new paths and establish trading networks</p>
//                 </div>
//               </Link>
//             </motion.div>
//           </motion.div>

//           <motion.div 
//             variants={containerVariants}
//             className="mt-16 text-center"
//           >
//             <motion.div 
//               variants={itemVariants}
//               className="inline-block"
//             >
//               <button
//                 onClick={() => setShowWalletModal(true)}
//                 className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-bold text-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
//               >
//                 Begin Your Journey
//               </button>
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Wallet Modal */}
//       <AnimatePresence>
//         {showWalletModal && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//             <motion.div
//               ref={modalRef}
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="modal-content relative w-full max-w-md bg-gray-900/95 rounded-xl border border-purple-500/20 shadow-xl"
//             >
//               <div className="p-6">
//                 <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
//                 <p className="text-gray-400 mb-6">Choose your preferred wallet:</p>
//                 <div className="space-y-2">
//                   {wallets.map((wallet) => (
//                     <WalletButton
//                       key={wallet.id}
//                       wallet={wallet}
//                       onSelect={handleWalletSelect}
//                       isLoading={authLoading}
//                       loadingWallet={loadingWallet}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </main>
//   );
// }


"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Compass, LayoutDashboard, Route, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useClickAway } from 'react-use';
import * as fcl from "@onflow/fcl";

// Reuse WalletButton component from Navbar
const WalletButton = ({ wallet, onSelect, isLoading, loadingWallet }) => (
  <button
    onClick={() => onSelect(wallet.id)}
    disabled={isLoading}
    className={`w-full flex items-center gap-3 p-6 rounded-lg border border-white/10 transition-all duration-300
      ${isLoading && loadingWallet === wallet.id 
        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse' 
        : 'hover:bg-white/5'}`}
  >
    <img src={wallet.icon} alt={wallet.name} className="w-8 h-8" />
    <div className="flex-1 text-left">
      <div className="font-semibold text-white">{wallet.name}</div>
      <div className="text-sm text-gray-400">Connect to {wallet.name}</div>
    </div>
    {isLoading && loadingWallet === wallet.id && (
      <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full" />
    )}
  </button>
);

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(null);
  const modalRef = useRef(null);

  useClickAway(modalRef, () => {
    if (showWalletModal) setShowWalletModal(false);
  });

  const wallets = [
    { id: 'flow', name: 'Flow Wallet', icon: '/flow.webp' },
    { id: 'blocto', name: 'Blocto Wallet', icon: '/blocto.png' },
    { id: 'dapper', name: 'Dapper Wallet', icon: '/dapper.png' }
  ];

  const handleWalletSelect = async (walletId) => {
    try {
      setLoadingWallet(walletId);
      fcl.config().put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");
      await fcl.authenticate();
      setShowWalletModal(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setLoadingWallet(null);
    }
  };

  // Particle effect for background
  useEffect(() => {
    const canvas = document.getElementById('particles');
    if (!(canvas instanceof HTMLCanvasElement)) return;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random(),
        size: Math.random() * 2
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        particle.y -= particle.speed;
        if (particle.y < 0) {
          particle.y = canvas.height;
          particle.x = Math.random() * canvas.width;
        }
      });
      
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <main className="min-h-screen relative overflow-hidden bg-gray-900 text-white">
      <canvas id="particles" className="absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 mt-11">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h1 
              className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500"
              variants={itemVariants}
            >
              African Trade Empire
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Build your trading empire in the heart of Africa. Trade rare NFT merchants, 
              establish lucrative routes, and become the most powerful trader in the realm.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants}>
              <Link href="/dashboard" 
                className="block group">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 transition-transform duration-300 group-hover:scale-[1.02] border border-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <LayoutDashboard className="w-12 h-12 mb-4 text-amber-500" />
                  <h2 className="text-2xl font-bold mb-2">Command Center</h2>
                  <p className="text-gray-400">Monitor your merchant fleet and trading empire stats</p>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/marketplace" 
                className="block group">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 transition-transform duration-300 group-hover:scale-[1.02] border border-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Compass className="w-12 h-12 mb-4 text-orange-500" />
                  <h2 className="text-2xl font-bold mb-2">NFT Marketplace</h2>
                  <p className="text-gray-400">Discover and trade unique merchant NFTs</p>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/trade" 
                className="block group">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-8 transition-transform duration-300 group-hover:scale-[1.02] border border-gray-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Route className="w-12 h-12 mb-4 text-yellow-500" />
                  <h2 className="text-2xl font-bold mb-2">Trade Routes</h2>
                  <p className="text-gray-400">Chart new paths and establish trading networks</p>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="mt-16 text-center"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-block"
            >
              <button
                onClick={() => setShowWalletModal(true)}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-bold text-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
              >
                Begin Your Journey
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wallet Modal */}
      <AnimatePresence>
        {showWalletModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content relative w-full max-w-md bg-gray-900/95 rounded-xl border border-purple-500/20 shadow-xl"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
                <p className="text-gray-400 mb-6">Choose your preferred wallet:</p>
                <div className="space-y-2">
                  {wallets.map((wallet) => (
                    <WalletButton
                      key={wallet.id}
                      wallet={wallet}
                      onSelect={handleWalletSelect}
                      isLoading={authLoading}
                      loadingWallet={loadingWallet}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}