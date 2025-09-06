"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Compass, LayoutDashboard, Route, Menu, X, Gamepad as GamepadIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClickAway } from 'react-use';
import * as fcl from "@onflow/fcl";

interface WalletType {
  id: string;
  name: string;
  icon: string;
}

interface WalletButtonProps {
  wallet: WalletType;
  onSelect: (walletId: string) => void;
  isLoading: boolean;
  loadingWallet: string | null;
}

interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const WalletButton: React.FC<WalletButtonProps> = ({ wallet, onSelect, isLoading, loadingWallet }) => (
  <button
    onClick={() => onSelect(wallet.id)}
    disabled={isLoading}
    className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6 rounded-lg border border-white/10 transition-all duration-300
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

export default function Navbar() {
  const { user, stacksUser, isLoading: authLoading, connectWallet, disconnectWallet, connectStacksWallet } = useAuth();
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<string>('');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useClickAway(modalRef, () => {
    if (showWalletModal) setShowWalletModal(false);
  });

  useClickAway(mobileMenuRef, () => {
    if (showMobileMenu) setShowMobileMenu(false);
  });

  // Updated wallet options to include Stacks wallets
  const wallets: WalletType[] = [
    { id: 'flow', name: 'Flow Wallet', icon: '/flow.webp' },
    { id: 'blocto', name: 'Blocto Wallet', icon: '/blocto.png' },
    { id: 'leather', name: 'Leather Wallet', icon: '/leather.png' },
    { id: 'xverse', name: 'Xverse Wallet', icon: '/xverse.png' }
  ];

  const navLinks: NavLink[] = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/marketplace', label: 'Marketplace', icon: Compass },
    { href: '/trade', label: 'Trade Routes', icon: Route },
    { href: '/play', label: 'Play Game', icon: GamepadIcon }
  ];

  const showToast = (message: string, type: 'success' | 'error' = 'success'): void => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleWalletSelect = async (walletId: string): Promise<void> => {
    try {
      setLoadingWallet(walletId);
      
      if (walletId === 'leather' || walletId === 'xverse') {
        // For Stacks wallets, we use the connectStacksWallet method
        await connectStacksWallet();
      } else {
        // For Flow wallets
        fcl.config().put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");
        await fcl.authenticate();
      }
      
      setShowWalletModal(false);
      showToast('Wallet connected successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast(`Failed to connect wallet: ${errorMessage}`, 'error');
    } finally {
      setLoadingWallet(null);
    }
  };

  const handleDisconnect = async (): Promise<void> => {
    try {
      await disconnectWallet();
      showToast('Wallet disconnected successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast(`Failed to disconnect: ${errorMessage}`, 'error');
    }
  };

  // Determine if a user is logged in with either Flow or Stacks
  const isAuthenticated = user.loggedIn || stacksUser !== null;
  
  // Get address to display based on which wallet is connected
  const getDisplayAddress = (): string => {
    if (user.loggedIn && user.addr) {
      return `${user.addr.substring(0, 6)}...${user.addr.substring(user.addr.length - 4)}`;
    } else if (stacksUser) {
      const stacksAddress = stacksUser.profile.stxAddress.mainnet || stacksUser.profile.stxAddress.testnet;
      return `${stacksAddress.substring(0, 6)}...${stacksAddress.substring(stacksAddress.length - 4)}`;
    }
    return '';
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full z-50 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 w-full">
          <div className="flex justify-between h-14 sm:h-16 lg:h-18 items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image src="/appIcon.jpg" width={32} height={32} alt="African Trade Empire" className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full" />
              <Link href="/" className="flex items-center">
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 leading-tight"
                >
                  <span className="hidden xs:inline">A.T Empire</span>
                  <span className="xs:hidden">ATE</span>
                </motion.span>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              <div className="flex items-center gap-1 xl:gap-2">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onHoverStart={() => setActiveLink(href)}
                      onHoverEnd={() => setActiveLink('')}
                      className="relative px-2 xl:px-4 py-2"
                    >
                      <div className="flex items-center gap-1.5 xl:gap-2 text-xs xl:text-sm font-medium relative z-10">
                        <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${activeLink === href ? 'text-white' : 'text-white/70'}`} />
                        <span className={`hidden xl:inline ${activeLink === href ? 'text-white' : 'text-white/70'}`}>
                          {label}
                        </span>
                      </div>
                      {activeLink === href && (
                        <motion.div
                          layoutId="navHover"
                          className="absolute inset-0 bg-white/10 rounded-lg"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30
                          }}
                        />
                      )}
                    </motion.div>
                  </Link>
                ))}
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isAuthenticated ? (
                  <button
                    onClick={handleDisconnect}
                    className="px-3 xl:px-4 py-1.5 xl:py-2 rounded-md xl:rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium flex items-center gap-1.5 xl:gap-2 transition-all duration-300 text-xs xl:text-sm"
                  >
                    <div className="w-1.5 h-1.5 xl:w-2 xl:h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="max-w-[80px] xl:max-w-none truncate">{getDisplayAddress()}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowWalletModal(true)}
                    className="px-3 xl:px-4 py-1.5 xl:py-2 rounded-md xl:rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium flex items-center gap-1.5 xl:gap-2 transition-all duration-300 text-xs xl:text-sm"
                  >
                    <Wallet className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
                    <span className="hidden xl:inline">Connect Wallet</span>
                    <span className="xl:hidden">Connect</span>
                  </button>
                )}
              </motion.div>
            </div>

            {/* Tablet and Mobile menu button */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Quick connect button for md screens */}
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDisconnect}
                    className="px-2 py-1.5 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium flex items-center gap-1.5 transition-all duration-300 text-xs"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="max-w-[60px] truncate">{getDisplayAddress()}</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowWalletModal(true)}
                    className="px-2 py-1.5 rounded-md bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium flex items-center gap-1.5 transition-all duration-300 text-xs"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </motion.button>
                )}
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-1.5 sm:p-2 rounded-md lg:rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile and Tablet menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-md"
            >
              <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} onClick={() => setShowMobileMenu(false)}>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-white/5 transition-colors border border-white/5"
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                      <span className="text-sm sm:text-base text-white/70 font-medium">{label}</span>
                    </motion.div>
                  </Link>
                ))}
                
                {/* Mobile wallet connection - only show on small screens */}
                <div className="pt-2 md:hidden">
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        handleDisconnect();
                        setShowMobileMenu(false);
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 text-sm"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="truncate max-w-[120px]">{getDisplayAddress()}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowWalletModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 text-sm"
                    >
                      <Wallet className="w-4 h-4" />
                      Connect Wallet
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Wallet Modal */}
      <AnimatePresence>
        {showWalletModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content relative w-full max-w-xs sm:max-w-sm lg:max-w-md bg-gray-900/95 rounded-xl border border-purple-500/20 shadow-xl overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
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

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-3 sm:bottom-4 right-3 sm:right-4 px-3 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white max-w-xs sm:max-w-sm z-50 text-sm sm:text-base`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { WalletButton };
