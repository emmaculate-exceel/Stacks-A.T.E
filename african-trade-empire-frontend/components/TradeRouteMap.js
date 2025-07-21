'use client'

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// This is a simplified map component that would visualize trade routes
// In a real implementation, you might use a library like react-simple-maps or Mapbox

const TradeRouteMap = ({ routes, selectedRouteId, onSelectRoute }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Map coordinates (simplified for illustration)
  const cities = {
    'Lagos': { x: 0.2, y: 0.5 },
    'Accra': { x: 0.25, y: 0.52 },
    'Marrakech': { x: 0.18, y: 0.2 },
    'Timbuktu': { x: 0.25, y: 0.35 },
    'Mombasa': { x: 0.68, y: 0.55 },
    'Zanzibar': { x: 0.7, y: 0.62 },
    'Cairo': { x: 0.5, y: 0.25 },
    'Khartoum': { x: 0.55, y: 0.4 },
    'Cape Town': { x: 0.45, y: 0.9 },
    'Port Elizabeth': { x: 0.55, y: 0.85 }
  };

  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw simplified African continent outline
    ctx.fillStyle = 'rgba(255, 165, 0, 0.1)';
    ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(width * 0.3, height * 0.1);  // North Africa
    ctx.bezierCurveTo(
      width * 0.45, height * 0.05,
      width * 0.6, height * 0.1,
      width * 0.7, height * 0.2   // Northeast Africa
    );
    ctx.lineTo(width * 0.75, height * 0.4);  // East Africa
    ctx.bezierCurveTo(
      width * 0.8, height * 0.6,
      width * 0.7, height * 0.8,
      width * 0.6, height * 0.9   // Southeast Africa
    );
    ctx.lineTo(width * 0.4, height * 0.95); // South Africa
    ctx.bezierCurveTo(
      width * 0.3, height * 0.85,
      width * 0.2, height * 0.7,
      width * 0.15, height * 0.5  // West Africa
    );
    ctx.bezierCurveTo(
      width * 0.1, height * 0.3,
      width * 0.2, height * 0.15,
      width * 0.3, height * 0.1   // Northwest Africa
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw routes
    routes.forEach(route => {
      const startCity = cities[route.start];
      const endCity = cities[route.end];
      
      if (startCity && endCity) {
        const startX = width * startCity.x;
        const startY = height * startCity.y;
        const endX = width * endCity.x;
        const endY = height * endCity.y;
        
        // Determine route color based on status and selection
        let routeColor;
        let lineWidth;
        
        if (route.id === selectedRouteId) {
          routeColor = 'rgba(255, 215, 0, 0.9)'; // Bright gold for selected
          lineWidth = 4;
        } else if (route.status === 'active') {
          routeColor = 'rgba(255, 165, 0, 0.7)'; // Orange for active
          lineWidth = 2;
        } else {
          routeColor = 'rgba(150, 150, 150, 0.4)'; // Gray for inactive
          lineWidth = 1.5;
        }
        
        // Draw route line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        // Add a slight curve to the route
        const controlPointX = (startX + endX) / 2;
        const controlPointY = (startY + endY) / 2 - 20;
        
        ctx.quadraticCurveTo(controlPointX, controlPointY, endX, endY);
        
        ctx.strokeStyle = routeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        
        // Draw animated dots along the route for active routes
        if (route.status === 'active') {
          const time = Date.now() / 1000;
          const dotPosition = ((time % 5) / 5); // 5-second animation cycle
          
          // Calculate position along the curve
          const animX = startX * (1 - dotPosition) * (1 - dotPosition) + 
                       2 * controlPointX * (1 - dotPosition) * dotPosition + 
                       endX * dotPosition * dotPosition;
          
          const animY = startY * (1 - dotPosition) * (1 - dotPosition) + 
                       2 * controlPointY * (1 - dotPosition) * dotPosition + 
                       endY * dotPosition * dotPosition;
          
          // Draw the moving dot
          ctx.beginPath();
          ctx.arc(animX, animY, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fill();
        }
      }
    });
    
    // Draw city markers
    Object.entries(cities).forEach(([cityName, position]) => {
      const cityX = width * position.x;
      const cityY = height * position.y;
      
      // Check if this city is part of the selected route
      const isPartOfSelectedRoute = routes.some(route => 
        (route.id === selectedRouteId) && (route.start === cityName || route.end === cityName)
      );
      
      // Draw city dot
      ctx.beginPath();
      ctx.arc(cityX, cityY, isPartOfSelectedRoute ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isPartOfSelectedRoute ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.7)';
      ctx.fill();
      
      // Draw city name
      ctx.font = isPartOfSelectedRoute ? 'bold 12px Arial' : '10px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText(cityName, cityX, cityY - 10);
    });
  };

  // Animation loop function
  const animate = () => {
    drawMap();
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Start the animation
    animate();
    
    // Clean up the animation when component unmounts
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [routes, selectedRouteId]); // Re-run when routes or selected route changes
  
  // Handle click events on the map to select routes
  const handleMapClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clickX = x / canvas.width;
    const clickY = y / canvas.height;
    
    // Check if click is near any route
    for (const route of routes) {
      const startCity = cities[route.start];
      const endCity = cities[route.end];
      
      if (startCity && endCity) {
        // Calculate midpoint of route
        const midX = (startCity.x + endCity.x) / 2;
        const midY = (startCity.y + endCity.y) / 2;
        
        // Check if click is near the route (simplified)
        const distance = Math.sqrt(
          Math.pow(clickX - midX, 2) + 
          Math.pow(clickY - midY, 2)
        );
        
        if (distance < 0.05) { // Threshold for selecting a route
          onSelectRoute(route);
          return;
        }
      }
    }
  };
  
  return (
    <div className="w-full h-full relative">
      {/* Background image of Africa (would be better with a proper map) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 z-0"></div>
      
      {/* Canvas for drawing routes */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10 cursor-pointer"
        width={800}
        height={600}
        onClick={handleMapClick}
      />
      
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800/80 p-3 rounded-lg z-20 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-1 bg-orange-500 rounded-full"></div>
          <span className="text-gray-300">Active Route</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-1 bg-gray-500 rounded-full"></div>
          <span className="text-gray-300">Inactive Route</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-300">Selected Route</span>
        </div>
      </div>
      
      {/* Helpful tip */}
      <div className="absolute top-4 right-4 bg-gray-800/80 p-3 rounded-lg z-20 text-xs max-w-xs">
        <p className="text-gray-300">Click on a route or select from the list below to view details</p>
      </div>
    </div>
  );
};

export default TradeRouteMap;