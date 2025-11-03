// No App.tsx, atualize a função renderGameSection:
const renderGameSection = (title: string, gamesList: Game[]) => {
  if (gamesList.length === 0) return null;
  return (
    <div className="mb-8">
      <h3 className="section-title">{title}</h3>
      <div className="games-grid">
        {gamesList.map((game) => (
          <GameCard 
            key={game.id}
            game={game} 
            isSelected={selectedGameId === game.id}
            onCardClick={handleCardClick}
            onTeamClick={handleTeamClick}
            onH2HClick={handleH2HClick}
            onAiAnalysisClick={handleOpenAiModal}
            onChatClick={handleOpenGameChat}
          />
        ))}
      </div>
    </div>
  );
};
