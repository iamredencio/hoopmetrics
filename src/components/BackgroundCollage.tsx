import React from 'react';
import { motion } from 'framer-motion';
import { collageImages } from '../lib/imageUrls';

export const BackgroundCollage: React.FC<{
  teamColor: { primary: string; secondary: string };
}> = ({ teamColor }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-stats-darker to-stats-darker z-10"
      />
      
      {/* Animated Shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20"
             style={{ background: `radial-gradient(circle at center, ${teamColor.secondary}22 0%, transparent 70%)` }} 
        />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-20"
             style={{ background: `radial-gradient(circle at center, ${teamColor.primary}22 0%, transparent 70%)` }} 
        />
      </motion.div>

      {/* Collage Grid */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 grid-rows-4 gap-4 p-8 opacity-10">
        {collageImages.map((imageUrl, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 1 }}
            className="relative overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm"
            style={{
              gridColumn: `span ${Math.floor(Math.random() * 2) + 1}`,
              gridRow: `span ${Math.floor(Math.random() * 2) + 1}`,
            }}
          >
            <img 
              src={imageUrl} 
              alt="Player"
              className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
              loading="lazy"
            />
            <div 
              className="absolute inset-0 bg-gradient-to-b from-transparent to-stats-darker/80"
              style={{ 
                background: `linear-gradient(135deg, ${teamColor.primary}11 0%, ${teamColor.secondary}22 100%)` 
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Dynamic Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path 
            d="M 50 0 L 0 0 0 50" 
            fill="none" 
            stroke={teamColor.secondary} 
            strokeWidth="0.5"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};