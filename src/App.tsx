import React, { useState } from 'react';
import { mockPlayers } from './data/mockPlayers';
import { PlayerDashboard } from './components/PlayerDashboard';
import { PlayerSelector } from './components/PlayerSelector';

const App: React.FC = () => {
  const [selectedPlayerId, setSelectedPlayerId] = useState(mockPlayers[0].player_id);
  const selectedPlayer = mockPlayers.find(p => p.player_id === selectedPlayerId) || mockPlayers[0];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <PlayerSelector 
          players={mockPlayers}
          selectedPlayerId={selectedPlayerId}
          onSelect={setSelectedPlayerId}
        />
        <PlayerDashboard player={selectedPlayer} />
      </div>
    </div>
  );
};

export default App;