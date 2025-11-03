import React from 'react';

interface SportFilterProps {
  sports: string[];
  activeSport: string;
  onSelectSport: (sport: string) => void;
}

const SportIcon: React.FC<{ sport: string }> = ({ sport }) => {
    const iconClass = "h-5 w-5 mr-2";
    switch (sport.toLowerCase()) {
        case 'futebol':
            return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 11a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1zM15 11a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1zM10 6a1 1 0 00-1 1v1a1 1 0 002 0V7a1 1 0 00-1-1zM7 10a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1zM13 10a1 1 0 011 1v1a1 1 0 01-2 0v-1a1 1 0 011-1z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 10a.5.5 0 000 1h9a.5.5 0 000-1h-9z" clipRule="evenodd" /></svg>;
        case 'basquete':
            return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 4a1 1 0 000 2 1 1 0 01-1 1 1 1 0 000 2 1 1 0 011 1 1 1 0 100 2 1 1 0 01-1 1 1 1 0 100 2 3 3 0 100-6 1 1 0 011-1zm7 0a1 1 0 100 2 1 1 0 01-1 1 1 1 0 100 2 1 1 0 011 1 1 1 0 100 2 1 1 0 01-1 1 1 1 0 100 2 3 3 0 100-6 1 1 0 011-1z" clipRule="evenodd" /></svg>;
        case 'tênis':
             return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 16a3.5 3.5 0 01-3.5-3.5V5a3 3 0 013-3h9a3 3 0 013 3v7.5a3.5 3.5 0 01-3.5 3.5h-8zM16 5a1 1 0 00-1-1H6a1 1 0 00-1 1v7.5a1.5 1.5 0 001.5 1.5h7A1.5 1.5 0 0015 12.5V5z" /><path d="M8 8a1 1 0 100-2 1 1 0 000 2z" /></svg>;
        case 'vôlei':
            return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>;
        case 'e-sports':
            return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /><path d="M16.172 8.172a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        default:
            return <svg xmlns="http://www.w3.org/2000/svg" className={iconClass} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.946l4.06-2.654a1 1 0 011.63.784l-1.324 4.545a1 1 0 01-1.282.69L13 8.364v3.272l2.084 1.362a1 1 0 01.316 1.376l-1.464 2.81a1 1 0 01-1.542.41L11 16.236v2.71a1 1 0 01-2 0v-2.71l-1.402 1.368a1 1 0 01-1.542-.41l-1.464-2.81a1 1 0 01.316-1.376L8 11.636V8.364l-2.062 1.353a1 1 0 01-1.282-.69L3.332 4.09a1 1 0 011.63-.784L9 5.946V2a1 1 0 01.7-.954l.3-.06z" clipRule="evenodd" /></svg>;
    }
}

const SportFilter: React.FC<SportFilterProps> = ({ sports, activeSport, onSelectSport }) => {
  return (
    <div className="border-b border-white/10 pb-2 mb-1">
      <div className="flex space-x-2 overflow-x-auto p-2">
        {sports.map((sport) => (
          <button
            key={sport}
            onClick={() => onSelectSport(sport)}
            className={`
              flex items-center justify-center
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
            <SportIcon sport={sport} />
            {sport}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SportFilter;
