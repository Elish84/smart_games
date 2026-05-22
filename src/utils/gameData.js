export const NIKUD_LIST = [
  { id: 'kamatz', name: 'קמץ', textToSpeech: 'קָמַץ', symbol: 'אָ' },
  { id: 'patach', name: 'פתח', textToSpeech: 'פַּתָח', symbol: 'אַ' },
  { id: 'tzere', name: 'צירה', textToSpeech: 'צֵירֶה', symbol: 'אֵ' },
  { id: 'segol', name: 'סגול', textToSpeech: 'סֶגּוֹל', symbol: 'אֶ' },
  { id: 'holam', name: 'חולם', textToSpeech: 'חוֹלָם', symbol: 'אוֹ' },
  { id: 'hirik', name: 'חיריק', textToSpeech: 'חִירִיק', symbol: 'אִ' },
  { id: 'kubutz', name: 'קובוץ', textToSpeech: 'קֻבּוּץ', symbol: 'אֻ' },
  { id: 'shuruk', name: 'שורוק', textToSpeech: 'שׁוּרוּק', symbol: 'אוּ' },
  { id: 'shva', name: 'שווא', textToSpeech: 'שְׁוָא', symbol: 'אְ' },
];

export const ENGLISH_LIST = [
  { id: 'a', textToSpeech: 'A', symbol: 'a' },
  { id: 'b', textToSpeech: 'B', symbol: 'b' },
  { id: 'c', textToSpeech: 'C', symbol: 'c' },
  { id: 'd', textToSpeech: 'D', symbol: 'd' },
  { id: 'e', textToSpeech: 'E', symbol: 'e' },
  { id: 'f', textToSpeech: 'F', symbol: 'f' },
  { id: 'g', textToSpeech: 'G', symbol: 'g' },
  { id: 'h', textToSpeech: 'H', symbol: 'h' },
  { id: 'i', textToSpeech: 'I', symbol: 'i' },
  { id: 'j', textToSpeech: 'J', symbol: 'j' },
  { id: 'k', textToSpeech: 'K', symbol: 'k' },
  { id: 'l', textToSpeech: 'L', symbol: 'l' },
  { id: 'm', textToSpeech: 'M', symbol: 'm' },
  { id: 'n', textToSpeech: 'N', symbol: 'n' },
  { id: 'o', textToSpeech: 'O', symbol: 'o' },
  { id: 'p', textToSpeech: 'P', symbol: 'p' },
  { id: 'q', textToSpeech: 'Q', symbol: 'q' },
  { id: 'r', textToSpeech: 'R', symbol: 'r' },
  { id: 's', textToSpeech: 'S', symbol: 's' },
  { id: 't', textToSpeech: 'T', symbol: 't' },
  { id: 'u', textToSpeech: 'U', symbol: 'u' },
  { id: 'v', textToSpeech: 'V', symbol: 'v' },
  { id: 'w', textToSpeech: 'W', symbol: 'w' },
  { id: 'x', textToSpeech: 'X', symbol: 'x' },
  { id: 'y', textToSpeech: 'Y', symbol: 'y' },
  { id: 'z', textToSpeech: 'Z', symbol: 'z' },
];

export const LEVELS = [
  { level: 1, timeLimit: 6000 },
  { level: 2, timeLimit: 4500 },
  { level: 3, timeLimit: 3000 },
  { level: 4, timeLimit: 2000 },
  { level: 5, timeLimit: 1000 },
];

export const saveScore = (name, score, gameMode) => {
  const key = `leaderboard_${gameMode}`;
  const existingStr = localStorage.getItem(key);
  let leaderboard = existingStr ? JSON.parse(existingStr) : [];
  leaderboard.push({ name, score, date: new Date().toISOString() });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10); // Keep top 10
  localStorage.setItem(key, JSON.stringify(leaderboard));
};

export const getLeaderboard = (gameMode) => {
  const key = `leaderboard_${gameMode}`;
  const existingStr = localStorage.getItem(key);
  return existingStr ? JSON.parse(existingStr) : [];
};

export const LEVEL_PRIZES = ['🥉', '🥈', '🥇', '🏆', '👑'];
