import React from 'react';

interface LeagueFilterProps {
  leagues: string[];
  activeLeague: string;
  onSelectLeague: (league: string) => void;
}

const LeagueFilter: React.FC<LeagueFilterProps> = ({ leagues, activeLeague, onSelectLeague }) => {
  return (
    <div className="border-b border-white/10 pb-2 mb-4">
      <div className="flex space-x-2 overflow-x-auto p-2">
        {leagues.map((league) => (
          <button
            key={league}
            onClick={() => onSelectLeague(league)}
            className={`
              whitespace-nowrap py-1.5 px-3 rounded-full font-semibold text-xs transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-1 focus:ring-offset-brand-bg
              ${
                activeLeague === league
                  ? 'bg-accent/20 text-accent'
                  : 'bg-card-bg text-text-secondary hover:bg-white/10 hover:text-text-primary'
              }
            `}
            aria-current={activeLeague === league ? 'page' : undefined}
          >
            {league === 'All' ? 'Todas as Ligas' : league}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeagueFilter;
