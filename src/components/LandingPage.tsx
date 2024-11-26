import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Award, Star } from 'lucide-react';
import { mockPlayers } from '../data/mockPlayers';
import { teamColors } from '../data/teamColors';
import { PlayerImage } from './PlayerImage';
import { BackgroundCollage } from './BackgroundCollage';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-stats-dark/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5"
  >
    <div className="text-nba-gold mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

export const LandingPage: React.FC<{
  onStartApp: () => void;
}> = ({ onStartApp }) => {
  const featuredPlayer = mockPlayers[0];
  const teamColor = teamColors[featuredPlayer.team];

  return (
    <div className="min-h-screen bg-stats-darker text-white overflow-hidden">
      <div className="relative min-h-screen">
        <BackgroundCollage teamColor={teamColor} />

        <div className="container mx-auto px-4 py-8 md:py-16 lg:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-nba-gold tracking-wider mb-4"
            >
              ADVANCED BASKETBALL ANALYTICS
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6"
            >
              Hoop
              <br />
              <span className="text-nba-gold">Metrics</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 mb-8"
            >
              Elevate your game understanding with professional-grade basketball analytics. 
              Track performance, analyze trends, and unlock deep insights into player statistics.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={onStartApp}
              className="bg-nba-gold text-stats-darker px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2 hover:bg-nba-gold/90 transition-colors"
            >
              Launch Dashboard <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Real-time Analytics"
              description="Track live performance metrics and game-by-game statistics"
            />
            <FeatureCard
              icon={<Award className="w-8 h-8" />}
              title="Career Insights"
              description="Comprehensive player history and career progression analysis"
            />
            <FeatureCard
              icon={<Star className="w-8 h-8" />}
              title="Advanced Metrics"
              description="Deep dive into advanced performance indicators and trends"
            />
          </div>
        </div>
      </div>
    </div>
  );
};