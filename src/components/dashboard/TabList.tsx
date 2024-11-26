import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
}

interface TabListProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tab: string) => void;
  teamColor: { primary: string; secondary: string };
}

export const TabList: React.FC<TabListProps> = ({
  tabs,
  activeTab,
  onChange,
  teamColor,
}) => {
  return (
    <div className="flex space-x-2 p-1 bg-stats-dark rounded-xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: teamColor.primary }}
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <span className={`relative z-10 ${
              isActive ? `text-${teamColor.secondary}` : 'text-gray-400'
            }`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};