"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, LayoutDashboard, Route } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useClickAway } from 'react-use';
import * as fcl from "@onflow/fcl";

interface Wallet {
  id: string;
  name: string;
  icon: string;
}

interface WalletButtonProps {
  wallet: Wallet;
  onSelect: (walletId: string) => void;
  isLoading: boolean;
  loadingWallet: string | null;
}

interface Particle {
  x: number;
  y: number;
  speed: number;
  size: number;
}

// Reuse WalletButton component from Navbar
const WalletButton: React.FC<WalletButtonProps> = ({ wallet, onSelect, isLoading, loadingWallet }) => (
  <button
    onClick={() => onSelect(wallet.id)}
    disabled={isLoading}
    className={`w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 rounded-lg border border-white/10 transition-all duration-300
      ${isLoading && loadingWallet === wallet.id 
        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse' 
        : 'hover:bg-white/5 hover:border-white/20'}`}
  >
    <Image src={wallet.icon} alt={wallet.name} width={32} height={32} className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full" />
    <div className="flex-1 text-left">
      <div className="font-semibold text-white text-sm sm:text-base">{wallet.name}</div>
      <div className="text-xs sm:text-sm text-gray-400">Connect to {wallet.name}</div>
    </div>
    {isLoading && loadingWallet === wallet.id && (
      <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/20 border-t-white rounded-full" />
    )}
  </button>
);

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useClickAway(modalRef, () => {
    if (showWalletModal) setShowWalletModal(false);
  });

  const wallets: Wallet[] = [
    { id: 'flow', name: 'Flow Wallet', icon: '/flow.webp' },
    { id: 'blocto', name: 'Blocto Wallet', icon: '/blocto.png' },
    { id: 'dapper', name: 'Dapper Wallet', icon: '/dapper.png' }
  ];

  const handleWalletSelect = async (walletId: string): Promise<void> => {
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
    const canvas = document.getElementById('particles') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random(),
        size: Math.random() * 2
      });
    }

    function animate(): void {
      if (!ctx) return;
      
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

    const handleResize = (): void => {
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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 mt-16 sm:mt-14 lg:mt-11">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center mb-12 sm:mb-16 lg:mb-20"
          >
            <motion.h1 
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 leading-tight"
              variants={itemVariants}
            >
              African Trade Empire
            </motion.h1>
            <motion.p 
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto px-4 leading-relaxed"
              variants={itemVariants}
            >
              Build your trading empire in the heart of Africa. Trade rare NFT merchants, 
              establish lucrative routes, and become the most powerful trader in the realm.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16"
          >
            <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
              <Link href="/dashboard" 
                className="block group h-full">
                <div className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8 transition-all duration-300 group-hover:scale-[1.02] border border-gray-700 h-full min-h-[200px] sm:min-h-[220px] lg:min-h-[240px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <LayoutDashboard className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-3 sm:mb-4 text-amber-500" />
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-white">Command Center</h2>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">Monitor your merchant fleet and trading empire stats</p>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/marketplace" 
                className="block group h-full">
                <div className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8 transition-all duration-300 group-hover:scale-[1.02] border border-gray-700 h-full min-h-[200px] sm:min-h-[220px] lg:min-h-[240px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Compass className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-3 sm:mb-4 text-orange-500" />
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-white">NFT Marketplace</h2>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">Discover and trade unique merchant NFTs</p>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href="/trade" 
                className="block group h-full">
                <div className="relative overflow-hidden rounded-xl lg:rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8 transition-all duration-300 group-hover:scale-[1.02] border border-gray-700 h-full min-h-[200px] sm:min-h-[220px] lg:min-h-[240px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Route className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mb-3 sm:mb-4 text-yellow-500" />
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-white">Trade Routes</h2>
                  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">Chart new paths and establish trading networks</p>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="text-center"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-block"
            >
              <button
                onClick={() => setShowWalletModal(true)}
                className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg lg:rounded-xl font-bold text-sm sm:text-base lg:text-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-amber-500/25 transform hover:scale-105"
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content relative w-full max-w-sm sm:max-w-md lg:max-w-lg bg-gray-900/95 rounded-xl border border-purple-500/20 shadow-xl overflow-hidden"
            >
              <div className="p-4 sm:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
                <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">Choose your preferred wallet:</p>
                <div className="space-y-2 sm:space-y-3">
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
