import React, { useState, useEffect } from 'react';
import { GameScreen } from './components/GameScreen';
import { LEVELS, saveScore, getLeaderboard, LEVEL_PRIZES } from './utils/gameData';
import './index.css';

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(0); 
  const [gameState, setGameState] = useState('start'); // start, playing, levelup, gameover, win, leaderboard
  const [gameMode, setGameMode] = useState('hebrew'); // 'hebrew' | 'english' | 'havarot'
  
  const [score, setScore] = useState(0);
  const [prizes, setPrizes] = useState([]);
  const [playerName, setPlayerName] = useState('');
  
  // Leaderboard state
  const [leaderboards, setLeaderboards] = useState({ hebrew: [], english: [], havarot: [] });
  const [isLoadingScores, setIsLoadingScores] = useState(false);

  const startGame = (mode) => {
    setGameMode(mode);
    setCurrentLevel(1);
    setScore(0);
    setPrizes([]);
    setPlayerName('');
    setGameState('playing');
  };

  const handleLevelComplete = () => {
    const newPrize = LEVEL_PRIZES[currentLevel - 1] || '🌟';
    setPrizes(prev => [...prev, newPrize]);

    if (currentLevel >= LEVELS.length) {
      setGameState('win');
    } else {
      setGameState('levelup');
    }
  };

  const nextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setGameState('playing');
  };

  const handleGameOver = () => {
    setGameState('gameover');
  };

  const goHome = () => {
    setGameState('start');
    setCurrentLevel(0);
    setScore(0);
  };

  const openLeaderboard = async () => {
    setGameState('leaderboard');
    setIsLoadingScores(true);
    
    // Fetch all 3 asynchronously
    const [hebrewScores, englishScores, havarotScores] = await Promise.all([
      getLeaderboard('hebrew'),
      getLeaderboard('english'),
      getLeaderboard('havarot')
    ]);
    
    setLeaderboards({
      hebrew: hebrewScores,
      english: englishScores,
      havarot: havarotScores
    });
    
    setIsLoadingScores(false);
  };

  const handleSaveScore = async () => {
    if (!playerName.trim()) return;
    
    const nameToSave = playerName.trim();
    const success = await saveScore(nameToSave, score, gameMode);
    
    if (success) {
      setPlayerName(''); 
      openLeaderboard();
    }
  };

  const HomeButton = () => (
    <button className="home-btn" onClick={goHome} title="חזור למסך הראשי">
      🏠
    </button>
  );

  const renderLeaderboardList = (scores) => {
    if (scores.length === 0) return <p>אין עדיין שיאים!</p>;
    return (
      <ul className="leaderboard-list">
        {scores.map((s, i) => {
          const dateStr = s.date ? new Date(s.date).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' }) : '';
          return (
            <li key={i}>
              <span className="rank">{i + 1}.</span> 
              <span className="name">{s.name}</span> 
              <span className="score">{s.score} נק'</span>
              {dateStr && <span className="date" style={{ fontSize: '0.85rem', color: '#718096', marginRight: '10px' }}>{dateStr}</span>}
            </li>
          );
        })}
      </ul>
    );
  };

  const renderLeaderboard = () => {
    return (
      <div className="card text-center leaderboard-card" dir="rtl" style={{ maxWidth: '900px' }}>
        <HomeButton />
        <h1 className="title text-gold">🏆 טבלת מנצחים 🏆</h1>
        
        {isLoadingScores ? (
          <div className="subtitle" style={{ margin: '40px 0' }}>טוען נתונים מהשרת... ⏳</div>
        ) : (
          <div className="leaderboard-container">
            <div className="leaderboard-col">
              <h2 className="subtitle">עברית 🇮🇱</h2>
              {renderLeaderboardList(leaderboards.hebrew)}
            </div>
            <div className="leaderboard-col">
              <h2 className="subtitle" style={{ color: '#805ad5' }}>הברות 🧩</h2>
              {renderLeaderboardList(leaderboards.havarot)}
            </div>
            <div className="leaderboard-col">
              <h2 className="subtitle">English 🇺🇸</h2>
              {renderLeaderboardList(leaderboards.english)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSaveScore = () => {
    return (
      <div className="save-score-section">
        <h3 className="text-xl font-bold mb-2">השיא שלך: {score} נקודות!</h3>
        {prizes.length > 0 && (
          <div className="prizes-display">
            הפרסים שצברת: {prizes.join(' ')}
          </div>
        )}
        <input 
          type="text" 
          placeholder="הכנס את השם שלך..." 
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="name-input"
          maxLength={15}
        />
        <button 
          className="primary-btn save-btn" 
          onClick={handleSaveScore}
          disabled={!playerName.trim()}
        >
          שמור שיא 💾
        </button>
      </div>
    );
  };

  const renderContent = () => {
    if (gameState === 'start') {
      return (
        <div className="card text-center" dir="rtl">
          <h1 className="title">בואו נשחק!</h1>
          <p className="subtitle">בחרו את סוג המשחק שתרצו לשחק:</p>
          <div className="mode-selection">
            <button className="primary-btn hebrew-btn" onClick={() => startGame('hebrew')}>
              משחק ניקוד (שמות הניקוד) 🇮🇱
            </button>
            <button className="primary-btn" style={{backgroundColor: '#805ad5'}} onClick={() => startGame('havarot')}>
              משחק הברות (אות + ניקוד) 🧩
            </button>
            <button className="primary-btn english-btn" onClick={() => startGame('english')}>
              משחק אותיות (English) 🇺🇸
            </button>
            <button className="primary-btn leaderboard-btn" onClick={openLeaderboard}>
              טבלת מנצחים 🏆
            </button>
          </div>
        </div>
      );
    }
    
    if (gameState === 'playing') {
      const levelData = LEVELS.find(l => l.level === currentLevel);
      return (
        <GameScreen 
          levelData={levelData} 
          gameMode={gameMode}
          score={score}
          setScore={setScore}
          onLevelComplete={handleLevelComplete} 
          onGameOver={handleGameOver} 
          onHome={goHome}
        />
      );
    }

    if (gameState === 'levelup') {
      const latestPrize = prizes[prizes.length - 1];
      return (
        <div className="card text-center bounce-in" dir="rtl">
          <HomeButton />
          <div className="icon-large">{latestPrize}</div>
          <h1 className="title text-green">כל הכבוד!</h1>
          <p className="subtitle">עברתם את שלב {currentLevel} בהצלחה!</p>
          <p className="score-display mb-4">ניקוד נוכחי: {score}</p>
          <button className="primary-btn" onClick={nextLevel}>לשלב הבא</button>
        </div>
      );
    }

    if (gameState === 'gameover') {
      return (
        <div className="card text-center shake" dir="rtl">
          <HomeButton />
          <div className="icon-large">😢</div>
          <h1 className="title text-red">אוי לא!</h1>
          <p className="subtitle">טעיתם או שהזמן נגמר.</p>
          {score > 0 && renderSaveScore()}
          <br/>
          <button className="primary-btn" style={{marginTop: '10px'}} onClick={() => startGame(gameMode)}>נסו שוב מהתחלה</button>
        </div>
      );
    }

    if (gameState === 'win') {
      return (
        <div className="card text-center bounce-in" dir="rtl">
          <HomeButton />
          <div className="icon-large">🏆</div>
          <h1 className="title text-gold">אלופים!</h1>
          <p className="subtitle">סיימתם את כל השלבים בהצלחה רבה!</p>
          {renderSaveScore()}
          <br/>
          <button className="primary-btn" style={{marginTop: '10px'}} onClick={() => startGame(gameMode)}>שחקו שוב</button>
        </div>
      );
    }

    if (gameState === 'leaderboard') {
      return renderLeaderboard();
    }
  };

  return (
    <div className="app-container">
      {renderContent()}
    </div>
  );
}
