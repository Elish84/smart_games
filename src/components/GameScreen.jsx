import React, { useState, useEffect, useRef } from 'react';
import { OptionButton } from './OptionButton';
import { NIKUD_LIST, ENGLISH_LIST, generateHavarotPool, generateHavarotOptions } from '../utils/gameData';
import { speak, playSuccessSound, playFailSound } from '../utils/audio';

export const GameScreen = ({ levelData, gameMode, score, setScore, onLevelComplete, onGameOver, onHome }) => {
  const isEnglish = gameMode === 'english';
  const isHavarot = gameMode === 'havarot';
  
  // Decide the pool based on the game mode
  let initialPool;
  if (isEnglish) {
    initialPool = [...ENGLISH_LIST];
  } else if (isHavarot) {
    initialPool = generateHavarotPool(10); // 10 questions per level for Havarot
  } else {
    initialPool = [...NIKUD_LIST];
  }

  const lang = isEnglish ? 'en-US' : 'he-IL';
  let titleText = 'איזה סימן ניקוד זה?';
  if (isEnglish) titleText = 'איזו אות זאת?';
  if (isHavarot) titleText = 'איזו הברה שמעת?';

  const [remainingNikud, setRemainingNikud] = useState(initialPool);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(levelData.timeLimit);
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null); 
  const timerRef = useRef(null);

  useEffect(() => {
    startNextQuestion(initialPool);
    return () => clearInterval(timerRef.current);
  }, []);

  const randomizeCase = (opt) => {
    if (!isEnglish) return opt;
    const isUpper = Math.random() > 0.5;
    return {
      ...opt,
      symbol: isUpper ? opt.symbol.toUpperCase() : opt.symbol.toLowerCase()
    };
  };

  const startNextQuestion = (pool) => {
    if (pool.length === 0) {
      onLevelComplete();
      return;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    const question = pool[randomIndex];
    
    let currentOptions = [];

    if (isHavarot) {
      currentOptions = generateHavarotOptions(question);
    } else {
      const others = initialPool.filter(n => n.id !== question.id);
      const shuffledOthers = others.sort(() => 0.5 - Math.random()).slice(0, 2);
      const rawOptions = [question, ...shuffledOthers].sort(() => 0.5 - Math.random());
      currentOptions = rawOptions.map(opt => randomizeCase(opt));
    }
    
    setCurrentQuestion(question);
    setOptions(currentOptions);
    setTimeLeft(levelData.timeLimit);
    setIsAnswering(false);
    setAnswerStatus(null);
    setRemainingNikud(pool);

    clearInterval(timerRef.current);
    
    speak(question.textToSpeech, lang, () => {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 100) {
            clearInterval(timerRef.current);
            handleTimeOut(question.id);
            return 0;
          }
          return prev - 100;
        });
      }, 100);
    });
  };

  const handleTimeOut = (correctId) => {
    if (isAnswering) return;
    setIsAnswering(true);
    playFailSound();
    setAnswerStatus({ selectedId: 'timeout', correctId });
    setTimeout(() => {
      onGameOver();
    }, 1500);
  };

  const handleOptionClick = (nikud) => {
    if (isAnswering) return;
    clearInterval(timerRef.current);
    setIsAnswering(true);

    if (nikud.id === currentQuestion.id) {
      playSuccessSound();
      setAnswerStatus({ selectedId: nikud.id, status: 'correct' });
      
      const timeBonus = Math.floor(timeLeft / 100);
      setScore(prev => prev + 10 + timeBonus);

      setTimeout(() => {
        const nextPool = remainingNikud.filter(n => n.id !== currentQuestion.id);
        startNextQuestion(nextPool);
      }, 1000);
    } else {
      playFailSound();
      setAnswerStatus({ selectedId: nikud.id, correctId: currentQuestion.id, status: 'incorrect' });
      setTimeout(() => {
        onGameOver();
      }, 1500);
    }
  };

  if (!currentQuestion) return null;

  const timePercentage = (timeLeft / levelData.timeLimit) * 100;
  let barColorClass = 'progress-bar-green';
  if (timePercentage < 50) barColorClass = 'progress-bar-yellow';
  if (timePercentage < 25) barColorClass = 'progress-bar-red';

  return (
    <div className="game-container" dir="rtl">
      <div className="header-info">
        <button className="home-btn-small" onClick={onHome} title="חזור למסך הראשי">🏠</button>
        <span className="level-text">שלב {levelData.level}</span>
        <span className="score-text">ניקוד: {score}</span>
        <span className="time-text">{Math.ceil(timeLeft / 1000)} שניות</span>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className={`progress-bar-fill ${barColorClass}`}
          style={{ width: `${timePercentage}%` }}
        ></div>
      </div>

      <div className="question-card">
        <button 
          onClick={() => speak(currentQuestion.textToSpeech, lang)}
          className="audio-btn"
          title="השמע שוב"
        >
          🔊
        </button>
        <h2 className="question-title">{titleText}</h2>
        
        <div className="options-container">
          {options.map((opt) => {
            let status = 'idle';
            if (answerStatus) {
              if (answerStatus.selectedId === opt.id) {
                status = answerStatus.status === 'correct' ? 'correct' : 'incorrect';
              } else if (answerStatus.correctId === opt.id) {
                status = 'highlight';
              }
            }

            return (
              <OptionButton 
                key={opt.id} 
                nikud={opt} 
                onClick={handleOptionClick}
                disabled={isAnswering}
                status={status}
              />
            );
          })}
        </div>
      </div>
      
      <div className="remaining-text">
        נשארו {remainingNikud.length} שאלות לשלב זה
      </div>
    </div>
  );
};
