import React from 'react';
import { motion } from 'framer-motion';

interface StatCircleProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatCircle: React.FC<StatCircleProps> = ({ 
  label, 
  value, 
  maxValue, 
  color,
  size = 'md' 
}) => {
  const percentage = (value / maxValue) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };

  return (
    <motion.div 
      className={`relative ${sizeClasses[size]} flex items-center justify-center`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg className="absolute w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          className="fill-none stroke-gray-800"
          strokeWidth="8"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          className="fill-none"
          strokeWidth="8"
          stroke={color}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="text-center z-10">
        <motion.div 
          className={`${textSizes[size]} font-bold text-white mb-1`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {value.toFixed(1)}
        </motion.div>
        <motion.div 
          className="text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {label}
        </motion.div>
      </div>
    </motion.div>
  );
};