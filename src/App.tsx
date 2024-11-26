import React, { useState } from 'react';
import { mockPlayers } from './data/mockPlayers';
import { PlayerDashboard } from './components/PlayerDashboard';
import { PlayerSelector } from './components/PlayerSelector';
import { LandingPage } from './components/LandingPage';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [selectedPlayerId, setSelectedPlayerId] = useState(mockPlayers[0].player_id);
  const selectedPlayer = mockPlayers.find(p => p.player_id === selectedPlayerId) || mockPlayers[0];

  if (showLanding) {
    return <LandingPage onStartApp={() => setShowLanding(false)} />;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-950 p-6"
      >
        <div className="max-w-7xl mx-auto">
          <PlayerSelector 
            players={mockPlayers}
            selectedPlayerId={selectedPlayerId}
            onSelect={setSelectedPlayerId}
          />
          <PlayerDashboard player={selectedPlayer} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default App;