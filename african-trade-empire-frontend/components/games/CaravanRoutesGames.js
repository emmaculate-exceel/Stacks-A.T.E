// 'use client'
// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { TrendingUp, RefreshCcw, Map, Coins, ArrowRight, Map as MapIcon, Clock, Award, ShoppingBag } from 'lucide-react';
// import { useAuth } from '@/context/AuthContext';

// const CaravanRoutesGame = () => {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [gameState, setGameState] = useState('setup'); // setup, playing, results
//   const [caravans, setCaravans] = useState([]);
//   const [resources, setResources] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [playerResources, setPlayerResources] = useState({
//     gold: 1000,
//     reputation: 50,
//   });
//   const [turn, setTurn] = useState(1);
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [selectedCaravan, setSelectedCaravan] = useState(null);
//   const [selectedResource, setSelectedResource] = useState(null);
//   const [gameMessage, setGameMessage] = useState(null);
//   const [gameHistory, setGameHistory] = useState([]);
//   const [caravanSpeed, setCaravanSpeed] = useState(1);
  
//   const gameMapRef = useRef(null);
  
//   // Game configuration
//   const MAX_TURNS = 10;

//   // Initialize the game
//   useEffect(() => {
//     if (gameState === 'setup') {
//       initializeGame();
//     }
//   }, [gameState]);

//   // Update caravan positions
//   useEffect(() => {
//     if (gameState === 'playing') {
//       const timer = setInterval(() => {
//         updateCaravans();
//       }, 1000 / caravanSpeed);
      
//       return () => clearInterval(timer);
//     }
//   }, [caravans, gameState, caravanSpeed]);

//   const initializeGame = () => {
//     setIsLoading(true);
    
//     // Define cities - each with position and market prices
//     const gameCities = [
//       { 
//         id: 1, 
//         name: 'Cairo', 
//         position: { x: 85, y: 20 }, 
//         market: { gold: 30, spice: 80, cloth: 50, ivory: 95 },
//         description: 'Major trade hub with Mediterranean access'
//       },
//       { 
//         id: 2, 
//         name: 'Timbuktu', 
//         position: { x: 30, y: 45 }, 
//         market: { gold: 60, spice: 40, cloth: 60, ivory: 70 },
//         description: 'Famous salt and gold trading center'
//       },
//       { 
//         id: 3, 
//         name: 'Zanzibar', 
//         position: { x: 75, y: 70 }, 
//         market: { gold: 70, spice: 20, cloth: 75, ivory: 55 },
//         description: 'Island spice trading port'
//       },
//       { 
//         id: 4, 
//         name: 'Lagos', 
//         position: { x: 25, y: 65 }, 
//         market: { gold: 50, spice: 60, cloth: 30, ivory: 75 },
//         description: 'Coastal city with access to inland routes'
//       },
//       { 
//         id: 5, 
//         name: 'Addis Ababa', 
//         position: { x: 70, y: 45 }, 
//         market: { gold: 65, spice: 65, cloth: 45, ivory: 40 },
//         description: 'Highland trading post with unique goods'
//       }
//     ];
    
//     // Define resources
//     const gameResources = [
//       { id: 1, name: 'Gold', value: 'gold', icon: '💰', basePrice: 50 },
//       { id: 2, name: 'Spice', value: 'spice', icon: '🌶️', basePrice: 30 },
//       { id: 3, name: 'Cloth', value: 'cloth', icon: '🧵', basePrice: 25 },
//       { id: 4, name: 'Ivory', value: 'ivory', icon: '🦴', basePrice: 60 }
//     ];
    
//     // Create initial caravans
//     const initialCaravans = [
//       { 
//         id: 1, 
//         name: 'Desert Traders', 
//         capacity: 100,
//         speed: 5,
//         cargo: [],
//         position: { ...gameCities[0].position },
//         targetCity: null,
//         progress: 0,
//         status: 'idle',
//         quality: 'common'
//       },
//       { 
//         id: 2, 
//         name: 'Coastal Fleet', 
//         capacity: 150,
//         speed: 4,
//         cargo: [],
//         position: { ...gameCities[3].position },
//         targetCity: null,
//         progress: 0,
//         status: 'idle',
//         quality: 'rare'
//       }
//     ];
    
//     setCities(gameCities);
//     setResources(gameResources);
//     setCaravans(initialCaravans);
//     setPlayerResources({
//       gold: 1000,
//       reputation: 50,
//     });
//     setTurn(1);
//     setGameState('playing');
//     setSelectedCity(null);
//     setSelectedCaravan(null);
//     setSelectedResource(null);
//     setGameMessage({ text: "Your trade empire begins! Buy low, sell high, and establish profitable routes.", type: "info" });
//     setGameHistory([{ turn: 0, event: "Your trade empire was established in Africa!" }]);
//     setIsLoading(false);
//   };

//   const updateCaravans = () => {
//     setCaravans(prevCaravans => {
//       return prevCaravans.map(caravan => {
//         if (caravan.status === 'traveling' && caravan.targetCity) {
//           const targetCity = cities.find(city => city.id === caravan.targetCity);
//           if (targetCity) {
//             // Update progress
//             const newProgress = caravan.progress + (caravan.speed / 100);
            
//             // If journey is complete
//             if (newProgress >= 1) {
//               // Record profit in history
//               const cargo = caravan.cargo[0];
//               if (cargo) {
//                 const buyPrice = cargo.buyPrice * cargo.quantity;
//                 const sellPrice = targetCity.market[cargo.resource] * cargo.quantity;
//                 const profit = sellPrice - buyPrice;
                
//                 setGameHistory(prev => [
//                   ...prev, 
//                   { 
//                     turn, 
//                     event: `${caravan.name} arrived in ${targetCity.name} and sold ${cargo.quantity} ${cargo.resource} for a profit of ${profit} gold!` 
//                   }
//                 ]);
                
//                 // Add profit to player gold
//                 setPlayerResources(prev => ({
//                   ...prev,
//                   gold: prev.gold + sellPrice
//                 }));
//               }
              
//               // Reset caravan
//               return {
//                 ...caravan,
//                 position: { ...targetCity.position },
//                 targetCity: null,
//                 progress: 0,
//                 status: 'idle',
//                 cargo: []
//               };
//             }
            
//             // Calculate new position based on progress
//             const startCity = cities.find(city => 
//               city.position.x === caravan.position.x && 
//               city.position.y === caravan.position.y && 
//               caravan.progress === 0
//             );
            
//             if (startCity) {
//               // Interpolate position between cities based on progress
//               const newX = startCity.position.x + (targetCity.position.x - startCity.position.x) * newProgress;
//               const newY = startCity.position.y + (targetCity.position.y - startCity.position.y) * newProgress;
              
//               return {
//                 ...caravan,
//                 position: { x: newX, y: newY },
//                 progress: newProgress
//               };
//             }
            
//             return {
//               ...caravan,
//               progress: newProgress
//             };
//           }
//         }
//         return caravan;
//       });
//     });
//   };

//   const sendCaravan = () => {
//     if (!selectedCaravan || !selectedCity || !selectedResource) {
//       setGameMessage({ text: "You must select a caravan, destination, and resource!", type: "error" });
//       return;
//     }
    
//     const caravan = caravans.find(c => c.id === selectedCaravan);
//     const city = cities.find(c => c.id === selectedCity);
//     const resource = resources.find(r => r.id === selectedResource);
    
//     if (caravan.status !== 'idle') {
//       setGameMessage({ text: "This caravan is already on a journey!", type: "error" });
//       return;
//     }
    
//     // Check if we're at a city
//     const currentCity = cities.find(c => 
//       Math.abs(c.position.x - caravan.position.x) < 5 && 
//       Math.abs(c.position.y - caravan.position.y) < 5
//     );
    
//     if (!currentCity) {
//       setGameMessage({ text: "Your caravan must be at a city to trade!", type: "error" });
//       return;
//     }
    
//     // Calculate available capacity and max quantity
//     const maxQuantity = Math.floor(caravan.capacity / resource.basePrice);
//     const affordableQuantity = Math.floor(playerResources.gold / currentCity.market[resource.value]);
//     const quantity = Math.min(maxQuantity, affordableQuantity);
    
//     if (quantity <= 0) {
//       setGameMessage({ text: "You can't afford any quantity of this resource!", type: "error" });
//       return;
//     }
    
//     // Calculate cost
//     const cost = quantity * currentCity.market[resource.value];
    
//     // Update player gold
//     setPlayerResources(prev => ({
//       ...prev,
//       gold: prev.gold - cost
//     }));
    
//     // Update caravan
//     setCaravans(prev => prev.map(c => {
//       if (c.id === caravan.id) {
//         return {
//           ...c,
//           targetCity: city.id,
//           status: 'traveling',
//           progress: 0,
//           cargo: [{
//             resource: resource.value,
//             quantity: quantity,
//             buyPrice: currentCity.market[resource.value]
//           }]
//         };
//       }
//       return c;
//     }));
    
//     // Add to history
//     setGameHistory(prev => [
//       ...prev, 
//       { 
//         turn, 
//         event: `${caravan.name} departed ${currentCity.name} for ${city.name} with ${quantity} ${resource.name}.` 
//       }
//     ]);
    
//     // End turn
//     endTurn();
//   };

//   const endTurn = () => {
//     if (turn < MAX_TURNS) {
//       setTurn(prev => prev + 1);
//       setSelectedCity(null);
//       setSelectedCaravan(null);
//       setSelectedResource(null);
//       setGameMessage({ text: `Turn ${turn + 1} of ${MAX_TURNS}`, type: "info" });
//     } else {
//       // Game over
//       setGameState('results');
//     }
//   };

//   const getQualityColor = (quality) => {
//     switch (quality) {
//       case 'legendary': return 'from-yellow-400 via-amber-500 to-orange-600';
//       case 'rare': return 'from-blue-400 via-indigo-500 to-violet-600';
//       default: return 'from-emerald-400 via-teal-500 to-green-600';
//     }
//   };

//   const getResourcePriceClass = (basePrice, marketPrice) => {
//     const diff = marketPrice - basePrice;
//     if (diff > 10) return "text-green-400";
//     if (diff < -10) return "text-red-400";
//     return "text-yellow-400";
//   };
  
//   const calculateTotalWealth = () => {
//     return playerResources.gold;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-amber-900/40 via-amber-800/30 to-gray-900 pt-16 pb-10">
//       <div className="max-w-7xl mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-8"
//         >
//           <div className="inline-block p-2 mb-4 rounded-xl bg-gray-800/50 border border-amber-500/20">
//             <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">
//               Caravan Routes
//             </h1>
//           </div>
          
//           <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
//             <div className="bg-gray-800/40 rounded-lg p-3 border border-amber-500/20">
//               <div className="flex items-center gap-2">
//                 <Coins className="w-5 h-5 text-yellow-400" />
//                 <span className="text-white font-mono">{playerResources.gold} Gold</span>
//               </div>
//             </div>
//             <div className="bg-gray-800/40 rounded-lg p-3 border border-amber-500/20">
//               <div className="flex items-center gap-2">
//                 <Award className="w-5 h-5 text-purple-400" />
//                 <span className="text-white font-mono">{playerResources.reputation} Reputation</span>
//               </div>
//             </div>
//             <div className="bg-gray-800/40 rounded-lg p-3 border border-amber-500/20">
//               <div className="flex items-center gap-2">
//                 <Clock className="w-5 h-5 text-blue-400" />
//                 <span className="text-white font-mono">Turn {turn}/{MAX_TURNS}</span>
//               </div>
//             </div>
//             <div className="bg-gray-800/40 rounded-lg p-3 border border-amber-500/20">
//               <div className="flex items-center gap-2">
//                 <TrendingUp className="w-5 h-5 text-green-400" />
//                 <span className="text-white font-mono">Speed: {caravanSpeed}x</span>
//                 <button 
//                   onClick={() => setCaravanSpeed(prev => prev < 5 ? prev + 1 : 1)}
//                   className="ml-2 p-1 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
//                 >
//                   <RefreshCcw className="w-3 h-3 text-white" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         <AnimatePresence mode="wait">
//           {gameState === 'playing' && (
//             <motion.div
//               key="playing"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
//             >
//               {/* Game Map */}
//               <div className="lg:col-span-2 bg-gray-800/30 rounded-xl border border-amber-500/20 p-4 h-96">
//                 <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center">
//                   <MapIcon className="w-5 h-5 mr-2" />
//                   Trade Map
//                 </h2>
//                 <div ref={gameMapRef} className="relative h-80 bg-[url('/api/placeholder/800/400')] bg-cover bg-center rounded-lg overflow-hidden">
//                   {/* Render cities */}
//                   {cities.map(city => (
//                     <div 
//                       key={city.id}
//                       className={`absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
//                         ${selectedCity === city.id ? 'bg-amber-400 ring-4 ring-amber-400/50' : 'bg-gray-200'}`}
//                       style={{ left: `${city.position.x}%`, top: `${city.position.y}%` }}
//                       onClick={() => setSelectedCity(city.id)}
//                     >
//                       <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
//                         <span className="px-2 py-1 bg-gray-900/80 rounded text-xs font-medium text-white">
//                           {city.name}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
                  
//                   {/* Render caravans */}
//                   {caravans.map(caravan => (
//                     <div
//                       key={caravan.id}
//                       className={`absolute flex items-center justify-center w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
//                         ${selectedCaravan === caravan.id ? 'ring-4 ring-amber-400/50' : ''}`}
//                       style={{ 
//                         left: `${caravan.position.x}%`, 
//                         top: `${caravan.position.y}%`,
//                         background: `linear-gradient(to right, #f59e0b, #d97706)`
//                       }}
//                       onClick={() => setSelectedCaravan(caravan.id)}
//                     >
//                       <span className="text-xs">🐪</span>
                      
//                       {/* Caravan info tooltip */}
//                       {selectedCaravan === caravan.id && (
//                         <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 z-10 whitespace-nowrap">
//                           <div className="px-2 py-1 bg-gray-900/90 rounded text-xs text-white">
//                             {caravan.name} - {caravan.status}
//                             {caravan.cargo.length > 0 && (
//                               <div>
//                                 Cargo: {caravan.cargo[0].quantity} {caravan.cargo[0].resource}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
                  
//                   {/* Render trade routes */}
//                   <svg className="absolute inset-0 w-full h-full pointer-events-none">
//                     {caravans.filter(c => c.status === 'traveling').map(caravan => {
//                       const targetCity = cities.find(city => city.id === caravan.targetCity);
//                       if (!targetCity) return null;
                      
//                       // Find the starting city
//                       const startCity = cities.find(city => 
//                         Math.abs(city.position.x - caravan.position.x) < 5 && 
//                         Math.abs(city.position.y - caravan.position.y) < 5 && 
//                         caravan.progress === 0
//                       );
                      
//                       if (!startCity && caravan.progress === 0) return null;
                      
//                       return (
//                         <path
//                           key={caravan.id}
//                           d={`M ${startCity ? startCity.position.x : caravan.position.x}% ${startCity ? startCity.position.y : caravan.position.y}% L ${targetCity.position.x}% ${targetCity.position.y}%`}
//                           stroke="rgba(245, 158, 11, 0.6)"
//                           strokeWidth="2"
//                           strokeDasharray="4"
//                           fill="none"
//                         />
//                       );
//                     })}
//                   </svg>
//                 </div>
//               </div>
              
//               {/* Control Panel */}
//               <div className="bg-gray-800/30 rounded-xl border border-amber-500/20 p-4 flex flex-col h-96">
//                 <h2 className="text-xl font-bold text-amber-400 mb-4">Trade Controls</h2>
                
//                 {gameMessage && (
//                   <div className={`p-3 rounded-lg mb-4 ${
//                     gameMessage.type === 'error' ? 'bg-red-900/30 border border-red-600/30' :
//                     gameMessage.type === 'success' ? 'bg-green-900/30 border border-green-600/30' :
//                     'bg-blue-900/30 border border-blue-600/30'
//                   }`}>
//                     <p className="text-sm text-white">{gameMessage.text}</p>
//                   </div>
//                 )}
                
//                 <div className="grid grid-cols-1 gap-4 mb-4 flex-grow overflow-y-auto">
//                   {/* Caravan selection */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-300 mb-2">Select Caravan:</label>
//                     <div className="grid grid-cols-1 gap-2">
//                       {caravans.map(caravan => (
//                         <button
//                           key={caravan.id}
//                           onClick={() => setSelectedCaravan(caravan.id)}
//                           className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
//                             selectedCaravan === caravan.id 
//                               ? 'bg-amber-900/30 border-amber-600/50'
//                               : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
//                           }`}
//                           disabled={caravan.status !== 'idle'}
//                         >
//                           <div className="flex items-center">
//                             <span className="text-lg mr-2">🐪</span>
//                             <div>
//                               <div className="text-sm font-medium text-white">{caravan.name}</div>
//                               <div className="text-xs text-gray-400">Capacity: {caravan.capacity}</div>
//                             </div>
//                           </div>
//                           <div className={`text-xs font-medium px-2 py-1 rounded-full ${
//                             caravan.status === 'idle' ? 'bg-green-900/50 text-green-400' : 'bg-amber-900/50 text-amber-400'
//                           }`}>
//                             {caravan.status.charAt(0).toUpperCase() + caravan.status.slice(1)}
//                           </div>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
                  
//                   {/* City selection */}
//                   {selectedCaravan && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">Select Destination:</label>
//                       <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
//                         {cities.map(city => {
//                           // Don't show the city we're currently at
//                           const caravan = caravans.find(c => c.id === selectedCaravan);
//                           const isCurrentCity = caravan && 
//                             Math.abs(city.position.x - caravan.position.x) < 5 && 
//                             Math.abs(city.position.y - caravan.position.y) < 5;
                            
//                           if (isCurrentCity) return null;
                          
//                           return (
//                             <button
//                               key={city.id}
//                               onClick={() => setSelectedCity(city.id)}
//                               className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
//                                 selectedCity === city.id 
//                                   ? 'bg-amber-900/30 border-amber-600/50'
//                                   : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
//                               }`}
//                             >
//                               <div className="text-sm font-medium text-white">{city.name}</div>
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
                  
//                   {/* Resource selection */}
//                   {selectedCaravan && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-300 mb-2">Select Resource:</label>
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                         {resources.map(resource => {
//                           // Get current city market price
//                           const caravan = caravans.find(c => c.id === selectedCaravan);
//                           const currentCity = cities.find(c => 
//                             Math.abs(c.position.x - caravan.position.x) < 5 && 
//                             Math.abs(c.position.y - caravan.position.y) < 5
//                           );
                          
//                           const marketPrice = currentCity ? currentCity.market[resource.value] : 0;
                          
//                           return (
//                             <button
//                               key={resource.id}
//                               onClick={() => setSelectedResource(resource.id)}
//                               className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
//                                 selectedResource === resource.id 
//                                   ? 'bg-amber-900/30 border-amber-600/50'
//                                   : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
//                               }`}
//                             >
//                               <div className="flex items-center">
//                                 <span className="text-lg mr-2">{resource.icon}</span>
//                                 <div className="text-sm font-medium text-white">{resource.name}</div>
//                               </div>
//                               {currentCity && (
//                                 <div className={`text-xs font-medium ${getResourcePriceClass(resource.basePrice, marketPrice)}`}>
//                                   {marketPrice}
//                                 </div>
//                               )}
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="mt-auto">
//                   <div className="flex justify-between gap-2">
//                     <button
//                       onClick={endTurn}
//                       className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors"
//                     >
//                       Skip Turn
//                     </button>
                    
//                     <button
//                       onClick={sendCaravan}
//                       disabled={!selectedCaravan || !selectedCity || !selectedResource}
//                       className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                     >
//                       <ArrowRight className="w-4 h-4 mr-1" />
//                       Send Caravan
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
          
//           {gameState === 'results' && (
//             <motion.div
//               key="results"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="bg-gray-800/30 rounded-xl border border-amber-500/20 p-6 mb-8"
//             >
//               <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500 mb-6">
//                 Trading Empire Results
//               </h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
//                   <h3 className="text-lg font-medium text-amber-400 mb-2">Final Treasury</h3>
//                   <p className="text-3xl font-bold text-white">{playerResources.gold} <span className="text-amber-500">Gold</span></p>
//                 </div>
                
//                 <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
//                   <h3 className="text-lg font-medium text-amber-400 mb-2">Trading Reputation</h3>
//                   <p className="text-3xl font-bold text-white">{playerResources.reputation} <span className="text-purple-400">Points</span></p>
//                 </div>
                
//                 <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
//                   <h3 className="text-lg font-medium text-amber-400 mb-2">Empire Value</h3>
//                   <p className="text-3xl font-bold text-white">{calculateTotalWealth()} <span className="text-green-400">Total</span></p>
//                 </div>
//               </div>
              
//               <h3 className="text-lg font-medium text-white mb-4">Trade History</h3>
//               <div className="bg-gray-900/30 rounded-lg p-4 max-h-60 overflow-y-auto mb-6">
//                 <ul className="space-y-2">
//                   {gameHistory.map((entry, index) => (
//                     <li key={index} className="text-sm text-gray-300 border-b border-gray-700/30 pb-2">
//                       {entry.turn > 0 && <span className="text-xs font-medium text-amber-500">Turn {entry.turn}: </span>}
//                       {entry.event}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
              
//               <div className="text-center">
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setGameState('setup')}
//                   className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg text-white font-medium"
//                 >
//                   Start New Empire
//                 </motion.button>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default CaravanRoutesGame;

'use client'
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, RefreshCcw, Map, Coins, ArrowRight, Map as MapIcon, Clock, Award, Download, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const CaravanRoutesGame = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState('setup'); // setup, playing, results
  const [caravans, setCaravans] = useState([]);
  const [resources, setResources] = useState([]);
  const [cities, setCities] = useState([]);
  const [playerResources, setPlayerResources] = useState({
    btc: 0.03, // Starting with 0.03 BTC
    stx: 500,  // Starting with 500 STX
    sbtc: 0.01 // Starting with 0.01 sBTC
  });
  const [turn, setTurn] = useState(1);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCaravan, setSelectedCaravan] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [gameMessage, setGameMessage] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [caravanSpeed, setCaravanSpeed] = useState(1);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawCrypto, setWithdrawCrypto] = useState('btc');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  
  const gameMapRef = useRef(null);
  
  // Game configuration
  const MAX_TURNS = 10;
  
  // Crypto prices (simulated market rates)
  const cryptoPrices = {
    btc: 60000, // 1 BTC = $60,000
    stx: 1.25,  // 1 STX = $1.25
    sbtc: 60000 // 1 sBTC = $60,000 (pegged to BTC)
  };

  // Initialize the game
  useEffect(() => {
    if (gameState === 'setup') {
      initializeGame();
    }
  }, [gameState]);

  // Update caravan positions
  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        updateCaravans();
      }, 1000 / caravanSpeed);
      
      return () => clearInterval(timer);
    }
  }, [caravans, gameState, caravanSpeed]);

  const initializeGame = () => {
    setIsLoading(true);
    
    // Define cities - each with position and market prices for crypto
    const gameCities = [
      { 
        id: 1, 
        name: 'Bitcoin City', 
        position: { x: 85, y: 20 }, 
        market: { btc: 0.9, stx: 1.1, sbtc: 1.2, nft: 0.85 },
        description: 'El Salvador\'s crypto hub'
      },
      { 
        id: 2, 
        name: 'Miami', 
        position: { x: 30, y: 45 }, 
        market: { btc: 1.05, stx: 0.9, sbtc: 1.0, nft: 1.1 },
        description: 'Bitcoin conference central'
      },
      { 
        id: 3, 
        name: 'Singapore', 
        position: { x: 75, y: 70 }, 
        market: { btc: 1.1, stx: 0.95, sbtc: 1.15, nft: 0.9 },
        description: 'Asian crypto trading hub'
      },
      { 
        id: 4, 
        name: 'Berlin', 
        position: { x: 25, y: 65 }, 
        market: { btc: 0.95, stx: 1.15, sbtc: 0.9, nft: 1.2 },
        description: 'European blockchain center'
      },
      { 
        id: 5, 
        name: 'Lagos', 
        position: { x: 70, y: 45 }, 
        market: { btc: 1.2, stx: 1.0, sbtc: 0.85, nft: 1.1 },
        description: 'African crypto adoption leader'
      }
    ];
    
    // Define resources (now crypto assets)
    const gameResources = [
      { id: 1, name: 'Bitcoin', value: 'btc', icon: '₿', basePrice: 1.0 },
      { id: 2, name: 'Stacks', value: 'stx', icon: 'Ӿ', basePrice: 1.0 },
      { id: 3, name: 'sBTC', value: 'sbtc', icon: '⟠₿', basePrice: 1.0 },
      { id: 4, name: 'NFT', value: 'nft', icon: '🖼️', basePrice: 1.0 }
    ];
    
    // Create initial caravans (now crypto traders)
    const initialCaravans = [
      { 
        id: 1, 
        name: 'Hodl Team', 
        capacity: 0.05, // BTC capacity
        speed: 5,
        cargo: [],
        position: { ...gameCities[0].position },
        targetCity: null,
        progress: 0,
        status: 'idle',
        quality: 'common'
      },
      { 
        id: 2, 
        name: 'Whale Traders', 
        capacity: 0.1, // BTC capacity
        speed: 4,
        cargo: [],
        position: { ...gameCities[3].position },
        targetCity: null,
        progress: 0,
        status: 'idle',
        quality: 'rare'
      }
    ];
    
    setCities(gameCities);
    setResources(gameResources);
    setCaravans(initialCaravans);
    setPlayerResources({
      btc: 0.03,
      stx: 500,
      sbtc: 0.01
    });
    setTurn(1);
    setGameState('playing');
    setSelectedCity(null);
    setSelectedCaravan(null);
    setSelectedResource(null);
    setGameMessage({ text: "Your crypto trading empire begins! Buy low, sell high across global markets.", type: "info" });
    setGameHistory([{ turn: 0, event: "Your crypto trading empire was established!" }]);
    setIsLoading(false);
  };

  const updateCaravans = () => {
    setCaravans(prevCaravans => {
      return prevCaravans.map(caravan => {
        if (caravan.status === 'traveling' && caravan.targetCity) {
          const targetCity = cities.find(city => city.id === caravan.targetCity);
          if (targetCity) {
            // Update progress
            const newProgress = caravan.progress + (caravan.speed / 100);
            
            // If journey is complete
            if (newProgress >= 1) {
              // Record profit in history
              const cargo = caravan.cargo[0];
              if (cargo) {
                const buyPrice = cargo.buyPrice * cargo.quantity;
                const sellPrice = targetCity.market[cargo.resource] * cargo.quantity;
                const profitMultiplier = sellPrice / buyPrice;
                const profit = cargo.quantity * (profitMultiplier - 1);
                
                // Add profit to player's crypto
                setPlayerResources(prev => ({
                  ...prev,
                  [cargo.resource]: prev[cargo.resource] + profit
                }));
                
                setGameHistory(prev => [
                  ...prev, 
                  { 
                    turn, 
                    event: `${caravan.name} arrived in ${targetCity.name} and traded ${cargo.quantity.toFixed(8)} ${cargo.resource.toUpperCase()} for a ${profitMultiplier > 1 ? 'profit' : 'loss'} of ${Math.abs(profit).toFixed(8)} ${cargo.resource.toUpperCase()}!` 
                  }
                ]);
              }
              
              // Reset caravan
              return {
                ...caravan,
                position: { ...targetCity.position },
                targetCity: null,
                progress: 0,
                status: 'idle',
                cargo: []
              };
            }
            
            // Calculate new position based on progress
            const startCity = cities.find(city => 
              Math.abs(city.position.x - caravan.position.x) < 5 && 
              Math.abs(city.position.y - caravan.position.y) < 5 && 
              caravan.progress === 0
            );
            
            if (startCity) {
              // Interpolate position between cities based on progress
              const newX = startCity.position.x + (targetCity.position.x - startCity.position.x) * newProgress;
              const newY = startCity.position.y + (targetCity.position.y - startCity.position.y) * newProgress;
              
              return {
                ...caravan,
                position: { x: newX, y: newY },
                progress: newProgress
              };
            }
            
            return {
              ...caravan,
              progress: newProgress
            };
          }
        }
        return caravan;
      });
    });
  };

  const sendCaravan = () => {
    if (!selectedCaravan || !selectedCity || !selectedResource) {
      setGameMessage({ text: "You must select a trader, destination, and crypto asset!", type: "error" });
      return;
    }
    
    const caravan = caravans.find(c => c.id === selectedCaravan);
    const city = cities.find(c => c.id === selectedCity);
    const resource = resources.find(r => r.id === selectedResource);
    
    if (caravan.status !== 'idle') {
      setGameMessage({ text: "This trader is already on a journey!", type: "error" });
      return;
    }
    
    // Check if we're at a city
    const currentCity = cities.find(c => 
      Math.abs(c.position.x - caravan.position.x) < 5 && 
      Math.abs(c.position.y - caravan.position.y) < 5
    );
    
    if (!currentCity) {
      setGameMessage({ text: "Your trader must be at a market to trade!", type: "error" });
      return;
    }
    
    // Get available balance for selected resource
    const availableBalance = playerResources[resource.value];
    
    // Determine trade amount (use 50% of available balance or capacity, whichever is smaller)
    const maxByCapacity = caravan.capacity;
    const maxByBalance = availableBalance * 0.5;
    const quantity = Math.min(maxByCapacity, maxByBalance);
    
    if (quantity <= 0) {
      setGameMessage({ text: `You don't have enough ${resource.value.toUpperCase()} to trade!`, type: "error" });
      return;
    }
    
    // Update player resources
    setPlayerResources(prev => ({
      ...prev,
      [resource.value]: prev[resource.value] - quantity
    }));
    
    // Update caravan
    setCaravans(prev => prev.map(c => {
      if (c.id === caravan.id) {
        return {
          ...c,
          targetCity: city.id,
          status: 'traveling',
          progress: 0,
          cargo: [{
            resource: resource.value,
            quantity: quantity,
            buyPrice: currentCity.market[resource.value]
          }]
        };
      }
      return c;
    }));
    
    // Add to history
    setGameHistory(prev => [
      ...prev, 
      { 
        turn, 
        event: `${caravan.name} departed ${currentCity.name} for ${city.name} with ${quantity.toFixed(8)} ${resource.value.toUpperCase()}.` 
      }
    ]);
    
    // End turn
    endTurn();
  };

  const endTurn = () => {
    if (turn < MAX_TURNS) {
      setTurn(prev => prev + 1);
      setSelectedCity(null);
      setSelectedCaravan(null);
      setSelectedResource(null);
      setGameMessage({ text: `Turn ${turn + 1} of ${MAX_TURNS}`, type: "info" });
    } else {
      // Game over
      setGameState('results');
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'legendary': return 'from-yellow-400 via-amber-500 to-orange-600';
      case 'rare': return 'from-blue-400 via-indigo-500 to-violet-600';
      default: return 'from-emerald-400 via-teal-500 to-green-600';
    }
  };

  const getResourcePriceClass = (resourceValue, marketPrice) => {
    if (marketPrice > 1.05) return "text-green-400";
    if (marketPrice < 0.95) return "text-red-400";
    return "text-yellow-400";
  };
  
  const calculateTotalWealthInUSD = () => {
    return (
      (playerResources.btc * cryptoPrices.btc) +
      (playerResources.stx * cryptoPrices.stx) +
      (playerResources.sbtc * cryptoPrices.sbtc)
    ).toFixed(2);
  };
  
  const getResourceIcon = (resourceValue) => {
    const resource = resources.find(r => r.value === resourceValue);
    return resource ? resource.icon : '';
  };
  
  const handleWithdraw = () => {
    // In a real implementation, this would connect to a wallet or exchange API
    setGameMessage({ 
      text: `Withdrawal of ${playerResources[withdrawCrypto].toFixed(8)} ${withdrawCrypto.toUpperCase()} initiated to ${withdrawAddress.substring(0, 8)}...`, 
      type: "success" 
    });
    setShowWithdrawModal(false);
  };

  const getCryptoFullName = (symbol) => {
    switch(symbol) {
      case 'btc': return 'Bitcoin';
      case 'stx': return 'Stacks';
      case 'sbtc': return 'sBTC';
      default: return symbol.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block p-2 mb-4 rounded-xl bg-gray-800/50 border border-amber-500/20">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600">
              ATF Caravan
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
            <div className="bg-gray-800/40 rounded-lg p-3 border border-amber-500/20">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-bold">₿</span>
                <span className="text-white font-mono">{playerResources.btc.toFixed(8)} BTC</span>
              </div>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-3 border border-amber-500/20">
              <div className="flex items-center gap-2">
                <span className="text-purple-400 font-bold">Ӿ</span>
                <span className="text-white font-mono">{playerResources.stx.toFixed(2)} STX</span>
              </div>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-3 border border-amber-500/20">
              <div className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">⟠₿</span>
                <span className="text-white font-mono">{playerResources.sbtc.toFixed(8)} sBTC</span>
              </div>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-3 border border-amber-500/20">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white font-mono">Turn {turn}/{MAX_TURNS}</span>
              </div>
            </div>
            <div className="bg-gray-800/40 rounded-lg p-3 border border-amber-500/20">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white font-mono">Speed: {caravanSpeed}x</span>
                <button 
                  onClick={() => setCaravanSpeed(prev => prev < 5 ? prev + 1 : 1)}
                  className="ml-2 p-1 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <RefreshCcw className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {gameState === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
            >
              {/* Game Map */}
              <div className="lg:col-span-2 bg-gray-800/30 rounded-xl border border-amber-500/20 p-4 h-96">
                <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center">
                  <MapIcon className="w-5 h-5 mr-2" />
                  Global Trading Map
                </h2>
                <div ref={gameMapRef} className="relative h-80 bg-[url('/api/placeholder/800/400')] bg-cover bg-center rounded-lg overflow-hidden">
                  {/* Render cities */}
                  {cities.map(city => (
                    <div 
                      key={city.id}
                      className={`absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
                        ${selectedCity === city.id ? 'bg-amber-400 ring-4 ring-amber-400/50' : 'bg-gray-200'}`}
                      style={{ left: `${city.position.x}%`, top: `${city.position.y}%` }}
                      onClick={() => setSelectedCity(city.id)}
                    >
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                        <span className="px-2 py-1 bg-gray-900/80 rounded text-xs font-medium text-white">
                          {city.name}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Render caravans */}
                  {caravans.map(caravan => (
                    <div
                      key={caravan.id}
                      className={`absolute flex items-center justify-center w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
                        ${selectedCaravan === caravan.id ? 'ring-4 ring-amber-400/50' : ''}`}
                      style={{ 
                        left: `${caravan.position.x}%`, 
                        top: `${caravan.position.y}%`,
                        background: `linear-gradient(to right, #f59e0b, #d97706)`
                      }}
                      onClick={() => setSelectedCaravan(caravan.id)}
                    >
                      <span className="text-xs">₿</span>
                      
                      {/* Caravan info tooltip */}
                      {selectedCaravan === caravan.id && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 z-10 whitespace-nowrap">
                          <div className="px-2 py-1 bg-gray-900/90 rounded text-xs text-white">
                            {caravan.name} - {caravan.status}
                            {caravan.cargo.length > 0 && (
                              <div>
                                Trading: {caravan.cargo[0].quantity.toFixed(8)} {caravan.cargo[0].resource.toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Render trade routes */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {caravans.filter(c => c.status === 'traveling').map(caravan => {
                      const targetCity = cities.find(city => city.id === caravan.targetCity);
                      if (!targetCity) return null;
                      
                      // Find the starting city
                      const startCity = cities.find(city => 
                        Math.abs(city.position.x - caravan.position.x) < 5 && 
                        Math.abs(city.position.y - caravan.position.y) < 5 && 
                        caravan.progress === 0
                      );
                      
                      if (!startCity && caravan.progress === 0) return null;
                      
                      return (
                        <path
                          key={caravan.id}
                          d={`M ${startCity ? startCity.position.x : caravan.position.x}% ${startCity ? startCity.position.y : caravan.position.y}% L ${targetCity.position.x}% ${targetCity.position.y}%`}
                          stroke="rgba(245, 158, 11, 0.6)"
                          strokeWidth="2"
                          strokeDasharray="4"
                          fill="none"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
              
              {/* Control Panel */}
              <div className="bg-gray-800/30 rounded-xl border border-amber-500/20 p-4 flex flex-col h-96">
                <h2 className="text-xl font-bold text-amber-400 mb-4">Trading Controls</h2>
                
                {gameMessage && (
                  <div className={`p-3 rounded-lg mb-4 ${
                    gameMessage.type === 'error' ? 'bg-red-900/30 border border-red-600/30' :
                    gameMessage.type === 'success' ? 'bg-green-900/30 border border-green-600/30' :
                    'bg-blue-900/30 border border-blue-600/30'
                  }`}>
                    <p className="text-sm text-white">{gameMessage.text}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-4 mb-4 flex-grow overflow-y-auto">
                  {/* Caravan selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Trader:</label>
                    <div className="grid grid-cols-1 gap-2">
                      {caravans.map(caravan => (
                        <button
                          key={caravan.id}
                          onClick={() => setSelectedCaravan(caravan.id)}
                          className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
                            selectedCaravan === caravan.id 
                              ? 'bg-amber-900/30 border-amber-600/50'
                              : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
                          }`}
                          disabled={caravan.status !== 'idle'}
                        >
                          <div className="flex items-center">
                            <span className="text-lg mr-2">₿</span>
                            <div>
                              <div className="text-sm font-medium text-white">{caravan.name}</div>
                              <div className="text-xs text-gray-400">Capacity: {caravan.capacity} BTC</div>
                            </div>
                          </div>
                          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                            caravan.status === 'idle' ? 'bg-green-900/50 text-green-400' : 'bg-amber-900/50 text-amber-400'
                          }`}>
                            {caravan.status.charAt(0).toUpperCase() + caravan.status.slice(1)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* City selection */}
                  {selectedCaravan && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Select Destination:</label>
                      <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                        {cities.map(city => {
                          // Don't show the city we're currently at
                          const caravan = caravans.find(c => c.id === selectedCaravan);
                          const isCurrentCity = caravan && 
                            Math.abs(city.position.x - caravan.position.x) < 5 && 
                            Math.abs(city.position.y - caravan.position.y) < 5;
                            
                          if (isCurrentCity) return null;
                          
                          return (
                            <button
                              key={city.id}
                              onClick={() => setSelectedCity(city.id)}
                              className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
                                selectedCity === city.id 
                                  ? 'bg-amber-900/30 border-amber-600/50'
                                  : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
                              }`}
                            >
                              <div className="text-sm font-medium text-white">{city.name}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Resource selection */}
                  {selectedCaravan && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Select Crypto:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {resources.map(resource => {
                          // Get current city market price
                          const caravan = caravans.find(c => c.id === selectedCaravan);
                          const currentCity = cities.find(c => 
                            Math.abs(c.position.x - caravan.position.x) < 5 && 
                            Math.abs(c.position.y - caravan.position.y) < 5
                          );
                          
                          const marketPrice = currentCity ? currentCity.market[resource.value] : 0;
                          
                          return (
                            <button
                              key={resource.id}
                              onClick={() => setSelectedResource(resource.id)}
                              className={`p-2 rounded-lg border flex items-center justify-between transition-colors ${
                                selectedResource === resource.id 
                                  ? 'bg-amber-900/30 border-amber-600/50'
                                  : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
                              }`}
                            >
                              <div className="flex items-center">
                                <span className="text-lg mr-2">{resource.icon}</span>
                                <div className="text-sm font-medium text-white">{resource.name}</div>
                              </div>
                              {currentCity && (
                                <div className={`text-xs font-medium ${getResourcePriceClass(resource.value, marketPrice)}`}>
                                  {marketPrice.toFixed(2)}x
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-auto">
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={endTurn}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-medium transition-colors"
                    >
                      Skip Turn
                    </button>
                    
                    <button
                      onClick={sendCaravan}
                      disabled={!selectedCaravan || !selectedCity || !selectedResource}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <ArrowRight className="w-4 h-4 mr-1" />
                      Trade Crypto
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {gameState === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gray-800/30 rounded-xl border border-amber-500/20p-6 mb-8"
            >
              <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-500 mb-6">
                Trading Results
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="text-lg font-medium text-amber-400 mb-2">Bitcoin (BTC)</h3>
                  <p className="text-3xl font-bold text-white">{playerResources.btc.toFixed(8)} <span className="text-yellow-500">₿</span></p>
                  <p className="text-sm text-gray-400 mt-2">~${(playerResources.btc * cryptoPrices.btc).toFixed(2)} USD</p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="text-lg font-medium text-amber-400 mb-2">Stacks (STX)</h3>
                  <p className="text-3xl font-bold text-white">{playerResources.stx.toFixed(2)} <span className="text-purple-400">Ӿ</span></p>
                  <p className="text-sm text-gray-400 mt-2">~${(playerResources.stx * cryptoPrices.stx).toFixed(2)} USD</p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="text-lg font-medium text-amber-400 mb-2">sBTC</h3>
                  <p className="text-3xl font-bold text-white">{playerResources.sbtc.toFixed(8)} <span className="text-blue-400">⟠₿</span></p>
                  <p className="text-sm text-gray-400 mt-2">~${(playerResources.sbtc * cryptoPrices.sbtc).toFixed(2)} USD</p>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 mb-6">
                <h3 className="text-lg font-medium text-amber-400 mb-2">Total Portfolio Value</h3>
                <p className="text-3xl font-bold text-white">${calculateTotalWealthInUSD()} <span className="text-green-400">USD</span></p>
              </div>
              
              <h3 className="text-lg font-medium text-white mb-4">Trading History</h3>
              <div className="bg-gray-900/30 rounded-lg p-4 max-h-60 overflow-y-auto mb-6">
                <ul className="space-y-2">
                  {gameHistory.map((entry, index) => (
                    <li key={index} className="text-sm text-gray-300 border-b border-gray-700/30 pb-2">
                      {entry.turn > 0 && <span className="text-xs font-medium text-amber-500">Turn {entry.turn}: </span>}
                      {entry.event}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Withdraw Crypto
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameState('setup')}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg text-white font-medium flex items-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Start New Game
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Withdraw Modal */}
        <AnimatePresence>
          {showWithdrawModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 rounded-xl border border-amber-500/20 p-6 max-w-md w-full"
              >
                <h3 className="text-xl font-bold text-white mb-6">Withdraw Your Crypto</h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Currency</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['btc', 'stx', 'sbtc'].map(crypto => (
                      <button
                        key={crypto}
                        onClick={() => setWithdrawCrypto(crypto)}
                        className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-colors ${
                          withdrawCrypto === crypto 
                            ? 'bg-amber-900/30 border-amber-600/50'
                            : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
                        }`}
                      >
                        <span className="text-xl mb-1">
                          {crypto === 'btc' ? '₿' : crypto === 'stx' ? 'Ӿ' : '⟠₿'}
                        </span>
                        <span className="text-xs font-medium text-white">{crypto.toUpperCase()}</span>
                        <span className="text-xs text-gray-400">{playerResources[crypto].toFixed(crypto === 'stx' ? 2 : 8)}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Destination Address</label>
                  <input
                    type="text"
                    placeholder={`Enter your ${getCryptoFullName(withdrawCrypto)} address`}
                    value={withdrawAddress}
                    onChange={e => setWithdrawAddress(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                
                <div className="flex justify-between gap-3">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleWithdraw}
                    disabled={!withdrawAddress}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Withdraw
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default CaravanRoutesGame;