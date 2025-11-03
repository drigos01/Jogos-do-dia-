import React from 'react';

interface SportFilterProps {
  sports: string[];
  activeSport: string;
  onSelectSport: (sport: string) => void;
}

const SportFilter: React.FC<SportFilterProps> = ({ sports, activeSport, onSelectSport }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {sports.map((sport) => (
        <button
          key={sport}
          onClick={() => onSelectSport(sport)}
          className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
            activeSport === sport
              ? 'bg-accent text-white'
              : 'bg-card-bg text-text-secondary hover:text-text-primary hover:bg-gray-700'
          }`}
        >
          {sport}
        </button>
      ))}
    </div>
  );
};

export default SportFilter;
