import React, { useState, useEffect } from 'react';
import { imageCache } from '../utils/imageCache';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import * as Avatar from '@radix-ui/react-avatar';

interface PlayerImageProps {
  playerId: string;
  name: string;
  teamColor: string;
  className?: string;
}

export const PlayerImage: React.FC<PlayerImageProps> = ({
  playerId,
  name,
  teamColor,
  className = ''
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadImage = async () => {
      try {
        setIsLoading(true);
        setError(false);
        const url = await imageCache.get(playerId);
        if (mounted) {
          setImageUrl(url);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(true);
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      mounted = false;
    };
  }, [playerId]);

  return (
    <Avatar.Root className={`relative overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-900"
          >
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: teamColor }} />
          </motion.div>
        ) : error ? (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full bg-gray-800 flex items-center justify-center"
          >
            <span className="text-2xl font-bold" style={{ color: teamColor }}>
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          </motion.div>
        ) : (
          <motion.div
            key="image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            <Avatar.Image
              src={imageUrl || ''}
              alt={name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Avatar.Root>
  );
};