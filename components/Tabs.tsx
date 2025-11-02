
import React from 'react';

interface TabsProps {
  sports: string[];
  activeTab: string;
  onTabClick: (sport: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ sports, activeTab, onTabClick }) => {
  return (
    <div className="border-b border-white/10">
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {sports.map((sport) => (
          <button
            key={sport}
            onClick={() => onTabClick(sport)}
            className={`${
              activeTab === sport
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-500'
            } whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm transition-colors duration-200 focus:outline-none`}
            aria-current={activeTab === sport ? 'page' : undefined}
          >
            {sport}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
