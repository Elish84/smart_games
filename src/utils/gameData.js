import { collection, addDoc, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from './firebase';

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
  { id: 'a', textToSpeech: 'a', symbol: 'a' },
  { id: 'b', textToSpeech: 'b', symbol: 'b' },
  { id: 'c', textToSpeech: 'c', symbol: 'c' },
  { id: 'd', textToSpeech: 'd', symbol: 'd' },
  { id: 'e', textToSpeech: 'e', symbol: 'e' },
  { id: 'f', textToSpeech: 'f', symbol: 'f' },
  { id: 'g', textToSpeech: 'g', symbol: 'g' },
  { id: 'h', textToSpeech: 'h', symbol: 'h' },
  { id: 'i', textToSpeech: 'i', symbol: 'i' },
  { id: 'j', textToSpeech: 'j', symbol: 'j' },
  { id: 'k', textToSpeech: 'k', symbol: 'k' },
  { id: 'l', textToSpeech: 'l', symbol: 'l' },
  { id: 'm', textToSpeech: 'm', symbol: 'm' },
  { id: 'n', textToSpeech: 'n', symbol: 'n' },
  { id: 'o', textToSpeech: 'o', symbol: 'o' },
  { id: 'p', textToSpeech: 'p', symbol: 'p' },
  { id: 'q', textToSpeech: 'q', symbol: 'q' },
  { id: 'r', textToSpeech: 'r', symbol: 'r' },
  { id: 's', textToSpeech: 's', symbol: 's' },
  { id: 't', textToSpeech: 't', symbol: 't' },
  { id: 'u', textToSpeech: 'u', symbol: 'u' },
  { id: 'v', textToSpeech: 'v', symbol: 'v' },
  { id: 'w', textToSpeech: 'w', symbol: 'w' },
  { id: 'x', textToSpeech: 'x', symbol: 'x' },
  { id: 'y', textToSpeech: 'y', symbol: 'y' },
  { id: 'z', textToSpeech: 'z', symbol: 'z' },
];

export const HEBREW_LETTERS_LIST = [
  'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'
];

export const NIKUD_SYMBOLS = [
  { id: 'kamatz', symbol: 'ָ' },
  { id: 'patach', symbol: 'ַ' },
  { id: 'tzere', symbol: 'ֵ' },
  { id: 'segol', symbol: 'ֶ' },
  { id: 'holam', symbol: 'ֹ' },
  { id: 'hirik', symbol: 'ִ' },
  { id: 'kubutz', symbol: 'ֻ' },
  { id: 'shuruk', symbol: 'וּ' }, 
  { id: 'shva', symbol: 'ְ' },
];

export const generateHavarotPool = (count = 10) => {
  const pool = [];
  for (let i = 0; i < count; i++) {
    const randomLetter = HEBREW_LETTERS_LIST[Math.floor(Math.random() * HEBREW_LETTERS_LIST.length)];
    const randomNikud = NIKUD_SYMBOLS[Math.floor(Math.random() * NIKUD_SYMBOLS.length)];
    const symbol = randomNikud.id === 'shuruk' ? randomLetter + 'וּ' : randomLetter + randomNikud.symbol;
    pool.push({
      id: `${randomLetter}-${randomNikud.id}-${i}`, 
      letter: randomLetter,
      nikudId: randomNikud.id,
      textToSpeech: symbol,
      symbol: symbol
    });
  }
  return pool;
};

export const generateHavarotOptions = (question) => {
  // Generate 2 other options with the SAME letter but DIFFERENT nikud
  const otherNikuds = NIKUD_SYMBOLS.filter(n => n.id !== question.nikudId).sort(() => 0.5 - Math.random()).slice(0, 2);
  const options = otherNikuds.map((n, idx) => {
    const symbol = n.id === 'shuruk' ? question.letter + 'וּ' : question.letter + n.symbol;
    return {
      id: `${question.letter}-${n.id}-wrong-${idx}`,
      symbol: symbol,
      textToSpeech: symbol,
      letter: question.letter,
      nikudId: n.id
    };
  });
  return [question, ...options].sort(() => 0.5 - Math.random());
};

export const LEVELS = [
  { level: 1, timeLimit: 6000 },
  { level: 2, timeLimit: 4500 },
  { level: 3, timeLimit: 3000 },
  { level: 4, timeLimit: 2000 },
  { level: 5, timeLimit: 1000 },
];

export const saveScore = async (name, score, gameMode) => {
  try {
    await addDoc(collection(db, 'leaderboards'), {
      name,
      score,
      gameMode,
      date: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error saving score to Firebase:", error);
    alert("שגיאה בשמירת התוצאה! ככל הנראה חסרת הרשאה. אנא ודא שהגדרת את ה-Rules ב-Firebase כראוי כפי שהוסבר.");
    return false;
  }
};

export const getLeaderboard = async (gameMode) => {
  try {
    const q = query(
      collection(db, 'leaderboards'),
      where('gameMode', '==', gameMode),
      orderBy('score', 'desc'),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      leaderboard.push(doc.data());
    });
    return leaderboard;
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    return [];
  }
};

export const LEVEL_PRIZES = ['🥉', '🥈', '🥇', '🏆', '👑'];
