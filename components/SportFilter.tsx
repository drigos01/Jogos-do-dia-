
import React from 'react';

interface SportFilterProps {
  sports: string[];
  activeSport: string;
  onSelectSport: (sport: string) => void;
}

const SportFilter: React.FC<SportFilterProps> = ({ sports, activeSport, onSelectSport }) => {
  return (
    <div className="border-b border-white/10 pb-2 mb-4">
      <div className="flex space-x-2 overflow-x-auto p-2 -mx-2">
        {sports.map((sport) => (
          <button
            key={sport}
            onClick={() => onSelectSport(sport)}
            className={`
              whitespace-nowrap py-2 px-4 rounded-full font-bold text-sm transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-brand-bg
              ${
                activeSport === sport
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-card-bg text-text-secondary hover:bg-white/10 hover:text-text-primary'
              }
            `}
            aria-current={activeSport === sport ? 'page' : undefined}
          >
            {sport}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SportFilter;
