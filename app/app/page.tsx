'use client';

import { useEffect, useMemo, useState } from 'react';

type Screen = 'home' | 'story' | 'kaapi' | 'blitz' | 'yaksha' | 'ending';
type Stats = { vibe: number; chaos: number; coins: number };
type Phrase = { kn: string; roman: string; english: string };
type Choice = {
  kn: string;
  roman: string;
  english: string;
  reaction: string;
  delta: Partial<Stats>;
  unlock: Phrase;
  loot: string;
};
type Scene = {
  chapter: string;
  time: string;
  location: string;
  character: string;
  glyph: string;
  color: string;
  kannada: string;
  roman: string;
  translation: string;
  narration: string;
  stamp: string;
  choices: Choice[];
};
type SaveData = {
  screen: Screen;
  sceneIndex: number;
  stats: Stats;
  phrases: Phrase[];
  souvenirs?: string[];
};

const STARTING_STATS: Stats = { vibe: 42, chaos: 18, coins: 650 };
const firstPhrase: Phrase = { kn: 'ನಮಸ್ಕಾರ', roman: 'Namaskara', english: 'Hello / respectful greeting' };

const scenes: Scene[] = [
  {
    chapter: 'THE WRONG BUS', time: '11:47 PM', location: 'BENGALURU', stamp: 'ಬೆಂಗಳೂರು', character: 'RANGA · AUTO ORACLE', glyph: 'ಏನ್?', color: '#8b5cf6',
    kannada: '“ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು, ಬಾಸ್?”', roman: 'Ellige hogabeku, boss?', translation: 'Where do you want to go, boss?',
    narration: 'A voice note says the Golden Filter trophy is on a red bus leaving Majestic. Ranga has no idea which bus. Confidence will have to become infrastructure.',
    choices: [
      { kn: 'ಬಸ್ ಸ್ಟ್ಯಾಂಡ್‌ಗೆ ಹೋಗಿ!', roman: 'Bus stand-ge hogi!', english: 'Go to the bus stand!', reaction: 'Ranga finds a shortcut known only to autos, pigeons, and urban planners in nightmares.', delta: { vibe: 9, chaos: 6, coins: -80 }, unlock: { kn: 'ಹೋಗಿ', roman: 'Hogi', english: 'Please go' }, loot: 'Crumpled Bengaluru bus ticket' },
      { kn: 'ನನಗೆ ಗೊತ್ತಿಲ್ಲ, ಬಾಸ್.', roman: 'Nanage gothilla, boss.', english: 'I don’t know, boss.', reaction: 'Radical honesty. Ranga calls four cousins and identifies the bus by its horn.', delta: { vibe: 7, chaos: -3, coins: -50 }, unlock: { kn: 'ನನಗೆ ಗೊತ್ತಿಲ್ಲ', roman: 'Nanage gothilla', english: 'I don’t know' }, loot: 'Auto dashboard blessing' },
    ],
  },
  {
    chapter: 'THE TOY CONSPIRACY', time: '12:36 AM', location: 'CHANNAPATNA', stamp: 'ಚನ್ನಪಟ್ಟಣ', character: 'MEERA · LACQUER BOSS', glyph: 'ಬಣ್ಣ', color: '#ffd600',
    kannada: '“ಬಣ್ಣ ಚೆನ್ನಾಗಿದೆಯಾ?”', roman: 'Banna chennagideya?', translation: 'Is the colour nice?',
    narration: 'The bus stops beside a workshop full of lacquered wooden toys. One spinning top has a tiny golden-filter symbol underneath it. Naturally, it is “not for sale.”',
    choices: [
      { kn: 'ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ!', roman: 'Tumba chennagide!', english: 'It’s very beautiful!', reaction: 'Flattery unlocks the premium drawer. Inside: a clue, a top, and a bill with artisanal confidence.', delta: { vibe: 11, coins: -90 }, unlock: { kn: 'ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ', roman: 'Tumba chennagide', english: 'It is very nice' }, loot: 'Channapatna lacquer top' },
      { kn: 'ಇನ್ನೊಂದು ತೋರಿಸಿ.', roman: 'Innondu torisi.', english: 'Show me another one.', reaction: 'Meera produces forty-seven options. You age visibly, but spot the clue on number forty-six.', delta: { chaos: 8, coins: -55 }, unlock: { kn: 'ಇನ್ನೊಂದು ತೋರಿಸಿ', roman: 'Innondu torisi', english: 'Show me another one' }, loot: 'Tiny wooden whistle' },
    ],
  },
  {
    chapter: 'THE HIGHWAY SNACK', time: '1:14 AM', location: 'MADDUR', stamp: 'ಮದ್ದೂರು', character: 'SAVITHRI · VADE AUTHORITY', glyph: 'ಬಿಸಿ', color: '#ff5a36',
    kannada: '“ವಡೆ ಬಿಸಿ ಇದೆ. ಬೇಕಾ?”', roman: 'Vade bisi ide. Beka?', translation: 'The vade is hot. Want one?',
    narration: 'Savithri refuses to discuss stolen trophies on an empty stomach. The crisp onion vade is both a snack and an entry requirement.',
    choices: [
      { kn: 'ಎರಡು ಕೊಡಿ, ಅಕ್ಕ.', roman: 'Eradu kodi, akka.', english: 'Two, please.', reaction: 'Excellent ordering. The second vade arrives wrapped in a receipt pointing toward Mysuru.', delta: { vibe: 12, coins: -50 }, unlock: { kn: 'ಎರಡು ಕೊಡಿ', roman: 'Eradu kodi', english: 'Two, please' }, loot: 'Maddur vade parcel' },
      { kn: 'ಒಂದು ಸಾಕು.', roman: 'Ondu saaku.', english: 'One is enough.', reaction: 'Savithri respects the restraint but slips a second one in anyway. Karnataka hospitality defeats mathematics.', delta: { vibe: 8, chaos: -2, coins: -30 }, unlock: { kn: 'ಸಾಕು', roman: 'Saaku', english: 'Enough' }, loot: 'Banana-leaf receipt' },
    ],
  },
  {
    chapter: 'PALACE AFTER HOURS', time: '2:02 AM', location: 'MYSURU', stamp: 'ಮೈಸೂರು', character: 'DEVIKA · PALACE FIXER', glyph: 'ಅರಮನೆ', color: '#ec4899',
    kannada: '“ಒಳಗೆ ಹೋಗಬೇಕಾ?”', roman: 'Olage hogabeka?', translation: 'Do you want to go inside?',
    narration: 'The palace is closed. Devika knows a rehearsal crew, a side gate, and exactly how much Mysuru pak it takes to make a guard reconsider policy.',
    choices: [
      { kn: 'ಹೌದು, ದಾರಿ ತೋರಿಸಿ.', roman: 'Howdu, daari torisi.', english: 'Yes, show me the way.', reaction: 'You enter through a door marked “Definitely Not A Secret Door.” A photo of Hampi waits inside.', delta: { vibe: 10, chaos: 5, coins: -70 }, unlock: { kn: 'ದಾರಿ ತೋರಿಸಿ', roman: 'Daari torisi', english: 'Show me the way' }, loot: 'After-hours palace pass' },
      { kn: 'ಮೊದಲು ಮೈಸೂರು ಪಾಕ್.', roman: 'Modalu Mysuru pak.', english: 'Mysuru pak first.', reaction: 'Strategic brilliance. The guard joins you. Nobody investigates efficiently while holding ghee.', delta: { vibe: 14, coins: -110 }, unlock: { kn: 'ಮೊದಲು', roman: 'Modalu', english: 'First / before that' }, loot: 'Box of Mysuru pak' },
    ],
  },
  {
    chapter: 'THE IMMOVABLE GETAWAY', time: '2:49 AM', location: 'HAMPI', stamp: 'ಹಂಪಿ', character: 'PAMPA · RUINS GUIDE', glyph: 'ರಥ', color: '#d97736',
    kannada: '“ಇದು ರಥ. ಟ್ಯಾಕ್ಸಿ ಅಲ್ಲ!”', roman: 'Idu ratha. Taxi alla!', translation: 'This is a chariot. Not a taxi!',
    narration: 'Your suspect is posing beside the Stone Chariot. You suggest a dramatic getaway. Pampa reminds you that protected monuments do not accept ride requests.',
    choices: [
      { kn: 'ಸರಿ, ನಿಧಾನವಾಗಿ ಹೋಗೋಣ.', roman: 'Sari, nidhaanavaagi hogona.', english: 'Okay, let’s go slowly.', reaction: 'Pampa approves the respectful retreat and reveals a Dharwad bus stub under the suspect’s hat.', delta: { vibe: 13, chaos: -5 }, unlock: { kn: 'ನಿಧಾನವಾಗಿ', roman: 'Nidhaanavaagi', english: 'Slowly' }, loot: 'Hampi panorama postcard' },
      { kn: 'ಒಂದು ಫೋಟೋ ಸಾಕು!', roman: 'Ondu photo saaku!', english: 'One photo is enough!', reaction: 'The photo is magnificent. Your suspect photobombs it, then drops the next clue while escaping.', delta: { vibe: 8, chaos: 7, coins: -20 }, unlock: { kn: 'ಒಂದು ಫೋಟೋ', roman: 'Ondu photo', english: 'One photo' }, loot: 'Blurry chariot selfie' },
    ],
  },
  {
    chapter: 'THE SWEET INTERROGATION', time: '3:31 AM', location: 'DHARWAD', stamp: 'ಧಾರವಾಡ', character: 'BASU · PEDA DIPLOMAT', glyph: 'ಪೇಡಾ', color: '#16a085',
    kannada: '“ಪೇಡಾ ಬೇಕಾ?”', roman: 'Peda beka?', translation: 'Would you like a peda?',
    narration: 'Basu knows where the trophy went, but all negotiations happen over Dharwad peda. This is less an interrogation than an aggressive dessert meeting.',
    choices: [
      { kn: 'ಹೌದು, ಎರಡು ಬಾಕ್ಸ್ ಕೊಡಿ.', roman: 'Howdu, eradu box kodi.', english: 'Yes, two boxes please.', reaction: 'Basu names you family, adds a third box, and whispers: “Udupi. Follow the drums.”', delta: { vibe: 14, coins: -160 }, unlock: { kn: 'ಹೌದು', roman: 'Howdu', english: 'Yes' }, loot: 'Dharwad peda tin' },
      { kn: 'ಚಿಕ್ಕ ಬಾಕ್ಸ್ ಸಾಕು.', roman: 'Chikka box saaku.', english: 'A small box is enough.', reaction: 'Basu looks wounded by your moderation, but the small box contains a very large clue.', delta: { vibe: 7, chaos: -2, coins: -70 }, unlock: { kn: 'ಚಿಕ್ಕದು', roman: 'Chikkadu', english: 'The small one' }, loot: 'Secret peda box' },
    ],
  },
  {
    chapter: 'THE MALNAD MIST', time: '3:08 AM', location: 'SHIVAMOGGA · MALNAD', stamp: 'ಶಿವಮೊಗ್ಗ', character: 'SHARADA · MONSOON GUIDE', glyph: 'ಮಲೆನಾಡು', color: '#176b5a',
    kannada: '“ಜೋಗದಲ್ಲಿ ಈಗ ನೀರು ಜಾಸ್ತಿ ಇದೆಯಾ?”', roman: 'Jogadalli iga neeru jaasti ideya?', translation: 'Is there much water at Jog right now?',
    narration: 'The rain turns the road silver. Sharada points toward Sagara and Jog Falls, then asks why your “shortcut” has three toll booths and a goat.',
    choices: [
      { kn: 'ಮೊದಲು ಕಾಫಿ ಸಿಗಬೇಕು.', roman: 'Modalu kaapi sigabeku.', english: 'First, we need coffee.', reaction: 'Correct Malnad priorities. A steel tumbler appears; the mist reveals the Dharwad bus stub.', delta: { vibe: 12, coins: -45 }, unlock: { kn: 'ಕಾಫಿ ಸಿಗಬೇಕು', roman: 'Kaapi sigabeku', english: 'We need coffee' }, loot: 'Shivamogga monsoon coffee card' },
      { kn: 'ಜೋಗಕ್ಕೆ ಹೋಗೋಣ!', roman: 'Jogakke hogona!', english: 'Let’s go to Jog!', reaction: 'You pick waterfall over logistics. Sharada hands you a rain cape and a map with the phrase “do not improvise.”', delta: { chaos: 10, vibe: 8, coins: -20 }, unlock: { kn: 'ಹೋಗೋಣ', roman: 'Hogona', english: 'Let’s go' }, loot: 'Malnad rain cape' },
    ],
  },
  {
    chapter: 'FOLLOW THE DRUMS', time: '4:07 AM', location: 'UDUPI COAST', stamp: 'ಉಡುಪಿ', character: 'KESHAVA · YAKSHAGANA LEAD', glyph: 'ತಾಳ', color: '#c62828',
    kannada: '“ತಾಳ ಹಿಡಿಯುತ್ತೀರಾ?”', roman: 'Taala hidiyutteera?', translation: 'Can you keep the rhythm?',
    narration: 'Backstage at a Yakshagana performance, Keshava has the Golden Filter tucked beside an enormous crown. He will talk after you prove you can follow a beat.',
    choices: [
      { kn: 'ಪ್ರಯತ್ನ ಮಾಡ್ತೀನಿ.', roman: 'Prayatna maadtini.', english: 'I’ll try.', reaction: 'Honest. Brave. The drummer quietly lowers expectations to a survivable level.', delta: { vibe: 10, chaos: -3 }, unlock: { kn: 'ಪ್ರಯತ್ನ ಮಾಡ್ತೀನಿ', roman: 'Prayatna maadtini', english: 'I will try' }, loot: 'Yakshagana backstage pass' },
      { kn: 'ನಾನು ರೆಡಿ!', roman: 'Naanu ready!', english: 'I’m ready!', reaction: 'The crown goes on your head. It weighs as much as your confidence and twice as much as your plan.', delta: { vibe: 9, chaos: 10 }, unlock: { kn: 'ನಾನು ರೆಡಿ', roman: 'Naanu ready', english: 'I am ready' }, loot: 'Red stage tassel' },
    ],
  },
  {
    chapter: 'RAIN, BEANS, REVELATION', time: '4:56 AM', location: 'KODAGU', stamp: 'ಕೊಡಗು', character: 'NANJAPPA · COFFEE SAGE', glyph: 'ಮಳೆ', color: '#2f855a',
    kannada: '“ಮಳೆ ಬರಬಹುದು.”', roman: 'Male barabahudu.', translation: 'It might rain.',
    narration: 'Among coffee plants and sudden mist, Nanjappa reveals the truth: the trophy was never stolen. You were the overnight courier. Everyone assumed you had read the group chat.',
    choices: [
      { kn: 'ಛತ್ರಿ ಇದೆಯಾ?', roman: 'Chhatri ideya?', english: 'Is there an umbrella?', reaction: 'There is not. There is, however, coffee hot enough to create its own weather system.', delta: { vibe: 8, coins: -40 }, unlock: { kn: 'ಇದೆಯಾ?', roman: 'Ideya?', english: 'Is there?' }, loot: 'Kodagu coffee beans' },
      { kn: 'ಮಳೆ ಚೆನ್ನಾಗಿದೆ.', roman: 'Male chennagide.', english: 'The rain is lovely.', reaction: 'Nanjappa nods. You stand in the rain like a music-video protagonist with poor logistics.', delta: { vibe: 13, chaos: 4 }, unlock: { kn: 'ಮಳೆ', roman: 'Male', english: 'Rain' }, loot: 'Emergency coffee-leaf poncho' },
    ],
  },
  {
    chapter: 'THE BIG DELIVERY', time: '6:01 AM', location: 'BENGALURU · AGAIN', stamp: 'ಕರ್ನಾಟಕ', character: 'KAVYA · EVENT DIRECTOR', glyph: 'ನಮ್ಮ', color: '#ffd600',
    kannada: '“ನಮ್ಮ ಕರ್ನಾಟಕ ಹೇಗಿತ್ತು?”', roman: 'Namma Karnataka hegittu?', translation: 'How was our Karnataka?',
    narration: 'You reach the red-and-yellow festival stage at sunrise. Geography is exhausted. Kavya accepts the Golden Filter and asks the only question that matters.',
    choices: [
      { kn: 'ತುಂಬಾ ಚೆನ್ನಾಗಿತ್ತು!', roman: 'Tumba chennagittu!', english: 'It was wonderful!', reaction: 'The crowd cheers. The trophy is safe. Your expense report is a work of speculative fiction.', delta: { vibe: 16, chaos: -6 }, unlock: { kn: 'ಚೆನ್ನಾಗಿತ್ತು', roman: 'Chennagittu', english: 'It was wonderful' }, loot: 'Red-and-yellow scarf' },
      { kn: 'ಮತ್ತೆ ಬರ್ತೀನಿ!', roman: 'Matte bartini!', english: 'I’ll come again!', reaction: 'Kavya hands you next year’s itinerary before you can clarify that this was not a formal commitment.', delta: { vibe: 13, chaos: 8 }, unlock: { kn: 'ಮತ್ತೆ ಬರ್ತೀನಿ', roman: 'Matte bartini', english: 'I will come again' }, loot: 'Official chaos courier badge' },
    ],
  },
];

const blitzRounds = [
  { prompt: 'The seller quotes ₹900 for sunglasses.', correct: 1, options: ['ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ', 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ', 'ನನಗೆ ಗೊತ್ತಿಲ್ಲ'] },
  { prompt: 'You need exactly one flower garland.', correct: 2, options: ['ಬೇಡ, ಬೇಡ', 'ಎಲ್ಲಿಗೆ?', 'ಒಂದು ಕೊಡಿ'] },
  { prompt: 'The auto driver asks if this turn is right.', correct: 0, options: ['ಹೌದು, ಇಲ್ಲಿ!', 'ತುಂಬಾ ಖಾರ', 'ಶುಭ ರಾತ್ರಿ'] },
  { prompt: 'You are done shopping. Escape politely.', correct: 1, options: ['ಇನ್ನೊಂದು ಬೇಕು', 'ಸಾಕು, ಧನ್ಯವಾದ', 'ಯಾಕೆ?'] },
];

const beatSequence = ['ಧಿ', 'ನಾ', 'ತೋಂ', 'ತಾ', 'ಧಿ', 'ತಾ', 'ನಾ', 'ತೋಂ'];
const SAVE_KEY = 'bengaluru-bluff-karnataka-v2';

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function impactText(delta: Partial<Stats>) {
  return (Object.entries(delta) as [keyof Stats, number][]).map(([key, value]) => `${value > 0 ? '+' : ''}${value} ${key === 'coins' ? '₹' : key.toUpperCase()}`);
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('home');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [stats, setStats] = useState<Stats>(STARTING_STATS);
  const [phrases, setPhrases] = useState<Phrase[]>([firstPhrase]);
  const [souvenirs, setSouvenirs] = useState<string[]>([]);
  const [result, setResult] = useState<{ text: string; impacts: string[] } | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [stashOpen, setStashOpen] = useState(false);
  const [stashTab, setStashTab] = useState<'passport' | 'phrases'>('passport');
  const [savedGame, setSavedGame] = useState<SaveData | null>(null);
  const [ready, setReady] = useState(false);
  const [shared, setShared] = useState(false);

  const [kaapiFill, setKaapiFill] = useState(0);
  const [kaapiTime, setKaapiTime] = useState(8);
  const [kaapiActive, setKaapiActive] = useState(false);
  const [kaapiDone, setKaapiDone] = useState(false);
  const [kaapiTaps, setKaapiTaps] = useState(0);

  const [blitzRound, setBlitzRound] = useState(0);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzTime, setBlitzTime] = useState(15);
  const [blitzActive, setBlitzActive] = useState(false);
  const [blitzDone, setBlitzDone] = useState(false);
  const [blitzFeedback, setBlitzFeedback] = useState<'right' | 'wrong' | null>(null);

  const [yakshaStep, setYakshaStep] = useState(0);
  const [yakshaScore, setYakshaScore] = useState(0);
  const [yakshaTime, setYakshaTime] = useState(12);
  const [yakshaActive, setYakshaActive] = useState(false);
  const [yakshaDone, setYakshaDone] = useState(false);
  const [yakshaFeedback, setYakshaFeedback] = useState<'right' | 'wrong' | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(SAVE_KEY);
        if (stored) setSavedGame(JSON.parse(stored) as SaveData);
      } catch { /* A bad save should never stop the night. */ }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready || screen === 'home') return;
    const save: SaveData = { screen, sceneIndex, stats, phrases, souvenirs };
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }, [ready, screen, sceneIndex, stats, phrases, souvenirs]);

  useEffect(() => {
    if (!kaapiActive) return;
    const timer = window.setTimeout(() => {
      if (kaapiTime <= 1) {
        setKaapiTime(0); setKaapiActive(false); setKaapiDone(true);
      } else setKaapiTime((time) => time - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [kaapiActive, kaapiTime]);

  useEffect(() => {
    if (!blitzActive) return;
    const timer = window.setTimeout(() => {
      if (blitzTime <= 1) {
        setBlitzTime(0); setBlitzActive(false); setBlitzDone(true);
      } else setBlitzTime((time) => time - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [blitzActive, blitzTime]);

  useEffect(() => {
    if (!yakshaActive) return;
    const timer = window.setTimeout(() => {
      if (yakshaTime <= 1) {
        setYakshaTime(0); setYakshaActive(false); setYakshaDone(true);
      } else setYakshaTime((time) => time - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [yakshaActive, yakshaTime]);

  const ending = useMemo(() => {
    if (stats.chaos >= 68) return { badge: 'ENDING 04', title: 'RED BUS LEGEND', glyph: 'ಅಯ್ಯೋ!', copy: 'You delivered the trophy, rerouted three buses, and became a story conductors will tell whenever someone asks “Are we there yet?”', color: '#c62828' };
    if (stats.vibe >= 80) return { badge: 'ENDING 01', title: 'KARNATAKA’S FAVOURITE GUEST', glyph: 'ಮಸ್ತ್!', copy: 'Ten stops, one trophy, zero enemies. You leave with enough snacks, phone numbers, and unsolicited travel advice to return forever.', color: '#ffd600' };
    if (stats.coins < 120) return { badge: 'ENDING 03', title: 'SNACK ROUTE SURVIVOR', glyph: 'ತಿಂಡಿ!', copy: 'The expense account is gone, but your bag contains a highly diversified portfolio of Karnataka snacks. Finance cannot take that away.', color: '#ff5a36' };
    return { badge: 'ENDING 02', title: 'GOLD FILTER COURIER', glyph: 'ಸರಿ!', copy: 'You crossed the state, kept the trophy safe, and learned the central rule of travel: when confused, find tea and ask someone’s auntie.', color: '#8b5cf6' };
  }, [stats]);

  function playTone(frequency = 420, duration = .07) {
    if (!soundOn || typeof window === 'undefined') return;
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'square';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.045, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
      oscillator.connect(gain); gain.connect(context.destination);
      oscillator.start(); oscillator.stop(context.currentTime + duration);
    } catch { /* Sound is a bonus. */ }
  }

  function buzz() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(18);
  }

  function startFresh() {
    setStats(STARTING_STATS); setPhrases([firstPhrase]); setSouvenirs([]); setSceneIndex(0); setResult(null); setScreen('story'); setShared(false);
    localStorage.removeItem(SAVE_KEY);
    playTone(520, .09);
  }

  function continueGame() {
    if (!savedGame) return;
    setStats(savedGame.stats); setPhrases(savedGame.phrases); setSouvenirs(savedGame.souvenirs ?? []); setSceneIndex(savedGame.sceneIndex);
    setScreen(savedGame.screen);
    playTone(520, .09);
  }

  function goHome() {
    const save: SaveData = { screen, sceneIndex, stats, phrases, souvenirs };
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    setSavedGame(save); setScreen('home');
  }

  function addPhrase(phrase: Phrase) {
    setPhrases((current) => current.some((item) => item.kn === phrase.kn) ? current : [...current, phrase]);
  }

  function applyDelta(delta: Partial<Stats>) {
    setStats((current) => ({
      vibe: clamp(current.vibe + (delta.vibe ?? 0)),
      chaos: clamp(current.chaos + (delta.chaos ?? 0)),
      coins: Math.max(0, current.coins + (delta.coins ?? 0)),
    }));
  }

  function choose(choice: Choice) {
    if (result) return;
    applyDelta(choice.delta); addPhrase(choice.unlock);
    setSouvenirs((current) => current.includes(choice.loot) ? current : [...current, choice.loot]);
    setResult({ text: choice.reaction, impacts: [...impactText(choice.delta), '+1 SOUVENIR'] });
    playTone(360 + sceneIndex * 24, .08); buzz();
  }

  function advanceStory() {
    setResult(null);
    if (sceneIndex === 2) { setScreen('kaapi'); setKaapiDone(false); setKaapiActive(false); setKaapiFill(0); setKaapiTime(8); return; }
    if (sceneIndex === 4) { setScreen('blitz'); setBlitzDone(false); setBlitzActive(false); setBlitzRound(0); setBlitzScore(0); setBlitzTime(15); return; }
    if (sceneIndex === 7) { setScreen('yaksha'); setYakshaDone(false); setYakshaActive(false); setYakshaStep(0); setYakshaScore(0); setYakshaTime(12); return; }
    if (sceneIndex === scenes.length - 1) { setScreen('ending'); return; }
    setSceneIndex((index) => index + 1);
  }

  function beginKaapi() {
    setKaapiFill(0); setKaapiTime(8); setKaapiTaps(0); setKaapiDone(false); setKaapiActive(true); playTone(540, .08);
  }

  function tapKaapi() {
    if (!kaapiActive) return;
    const nextFill = Math.min(100, kaapiFill + 9);
    setKaapiFill(nextFill);
    setKaapiTaps((taps) => taps + 1); playTone(260 + kaapiTaps * 13, .035); buzz();
    if (nextFill >= 100) { setKaapiActive(false); setKaapiDone(true); playTone(620, .16); }
  }

  function claimKaapi() {
    const won = kaapiFill >= 100;
    applyDelta(won ? { vibe: 12, coins: 40 } : { chaos: 7, vibe: 3 });
    addPhrase({ kn: 'ಒಂದು ಕಾಫಿ ಕೊಡಿ', roman: 'Ondu kaapi kodi', english: 'One coffee, please' });
    setSouvenirs((current) => current.includes('Steel kaapi tumbler') ? current : [...current, 'Steel kaapi tumbler']);
    setSceneIndex(3); setScreen('story'); setKaapiDone(false);
  }

  function beginBlitz() {
    setBlitzRound(0); setBlitzScore(0); setBlitzTime(15); setBlitzDone(false); setBlitzFeedback(null); setBlitzActive(true); playTone(540, .08);
  }

  function pickBlitz(option: number) {
    if (!blitzActive || blitzFeedback) return;
    const right = option === blitzRounds[blitzRound].correct;
    if (right) setBlitzScore((score) => score + 1);
    setBlitzFeedback(right ? 'right' : 'wrong'); playTone(right ? 650 : 170, .08); buzz();
    window.setTimeout(() => {
      setBlitzFeedback(null);
      if (blitzRound === blitzRounds.length - 1) { setBlitzActive(false); setBlitzDone(true); }
      else setBlitzRound((round) => round + 1);
    }, 480);
  }

  function claimBlitz() {
    applyDelta({ vibe: blitzScore * 3, coins: blitzScore * 25, chaos: blitzScore < 2 ? 6 : -2 });
    addPhrase({ kn: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ', roman: 'Swalpa kadime maadi', english: 'Please make it a little less' });
    setSouvenirs((current) => current.includes('Hampi bazaar bargain token') ? current : [...current, 'Hampi bazaar bargain token']);
    setSceneIndex(5); setScreen('story'); setBlitzDone(false);
  }

  function beginYaksha() {
    setYakshaStep(0); setYakshaScore(0); setYakshaTime(12); setYakshaDone(false); setYakshaFeedback(null); setYakshaActive(true); playTone(410, .09);
  }

  function tapBeat(beat: string) {
    if (!yakshaActive || yakshaFeedback) return;
    const right = beat === beatSequence[yakshaStep];
    if (right) setYakshaScore((score) => score + 1);
    setYakshaFeedback(right ? 'right' : 'wrong'); playTone(right ? 720 : 150, .07); buzz();
    window.setTimeout(() => {
      setYakshaFeedback(null);
      if (yakshaStep === beatSequence.length - 1) { setYakshaActive(false); setYakshaDone(true); }
      else setYakshaStep((step) => step + 1);
    }, 260);
  }

  function claimYaksha() {
    applyDelta({ vibe: yakshaScore * 2, coins: yakshaScore >= 6 ? 80 : 20, chaos: yakshaScore < 4 ? 7 : -3 });
    addPhrase({ kn: 'ತಾಳ ಹಿಡಿಯಿರಿ', roman: 'Taala hidiyiri', english: 'Keep the rhythm' });
    setSouvenirs((current) => current.includes('Pocket rhythm cymbals') ? current : [...current, 'Pocket rhythm cymbals']);
    setSceneIndex(8); setScreen('story'); setYakshaDone(false);
  }

  async function shareEnding() {
    const text = `I got “${ending.title}” in Bengaluru Bluff: Karnataka Detour — ${stats.vibe}% vibe, ${stats.chaos}% chaos, ${souvenirs.length} souvenirs.`;
    try {
      if (navigator.share) await navigator.share({ title: 'Bengaluru Bluff', text });
      else await navigator.clipboard.writeText(text);
      setShared(true); playTone(680, .1);
    } catch { /* Cancelled shares are fine. */ }
  }

  const isPlaying = screen !== 'home';

  return (
    <main className="game-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <section className="phone-stage" aria-label="Bengaluru Bluff game">
        <header className={`topbar ${isPlaying ? 'topbar-playing' : ''}`}>
          <button className="brand-mark" onClick={() => isPlaying && goHome()} aria-label={isPlaying ? 'Go to start screen' : 'Bengaluru Bluff'}><img src="/favicon.png" alt="" /></button>
          {isPlaying ? (
            <div className="stat-strip" aria-label="Game stats">
              <span><b>✦ {stats.vibe}</b><small>VIBE</small></span>
              <span><b>⚡ {stats.chaos}</b><small>CHAOS</small></span>
              <span><b>₹{stats.coins}</b><small>CASH</small></span>
            </div>
          ) : <div><p className="eyebrow">KARNATAKA · ONE IMPOSSIBLE NIGHT</p><p className="tiny-title">Kannada, but make it road-trip chaos.</p></div>}
          <button className="sound-button" onClick={() => setSoundOn((value) => !value)} aria-label={`Turn sound ${soundOn ? 'off' : 'on'}`}>{soundOn ? '♪' : '×'}</button>
        </header>

        {screen === 'home' && (
          <div className="landing-panel screen-enter">
            <div className="episode-chip">NEW · THE KARNATAKA DETOUR</div>
            <div className="title-stack" aria-label="Bengaluru Bluff"><img className="hero-logo" src="/logo.png" alt="Bengaluru Bluff Karnataka detour" /><span className="kannada-title">ನಮ್ಮ ಕರ್ನಾಟಕ</span><h1>BENGALURU<br /><i>BLUFF</i></h1></div>
            <div className="city-scene state-scene" aria-hidden="true">
              <div className="flag-stripe" /><span className="moon">☾</span><span className="city-word city-word-one">ಮಸ್ತ್</span><span className="city-word city-word-two">ಏನ್?</span><div className="hill-line" /><div className="road-line" />
              <div className="red-bus"><div className="bus-sign">ಕರ್ನಾಟಕ</div><div className="bus-windows"><i /><i /><i /><i /></div><b>KA 01</b><span className="bus-wheel bus-wheel-one" /><span className="bus-wheel bus-wheel-two" /></div>
            </div>
            <div className="route-preview"><span>BENGALURU</span><i>→</i><span>MYSURU</span><i>→</i><span>HAMPI</span><i>→</i><span>MALNAD</span><i>→</i><span>COAST</span></div>
            <div className="hook-card"><span className="hook-number">10</span><div><strong>One state. Ten stops.</strong><p>Chase a stolen trophy across Karnataka using snacks, vibes, and wildly questionable choices.</p></div></div>
            <div className="passport-teaser">
              <div className="passport-title"><span>KARNATAKA CHAOS PASSPORT</span><b>KA</b></div>
              <div className="stamp-cloud">{scenes.map((scene, index) => <span key={scene.stamp}><i>0{index + 1}</i>{scene.stamp}</span>)}</div>
            </div>
            <div className="feature-grid"><div><b>10</b><span>STORY STOPS</span></div><div><b>3</b><span>ARCADE BREAKS</span></div><div><b>4</b><span>CHAOTIC ENDINGS</span></div></div>
            <button className="primary-button" onClick={startFresh}><span>{savedGame ? 'START A NEW DETOUR' : 'BOARD THE RED BUS'}</span><span className="button-arrow">↗</span></button>
            {savedGame && <button className="secondary-button" onClick={continueGame}>CONTINUE LAST DISASTER <span>→</span></button>}
            <p className="microcopy">About 12 minutes · 3 arcade games · Judgment optional</p>
          </div>
        )}

        {screen === 'story' && (() => {
          const scene = scenes[sceneIndex];
          return (
            <div className="story-screen screen-enter" key={sceneIndex}>
              <div className="progress-row"><span>CH. {sceneIndex + 1}</span><div className="progress-track"><span style={{ width: `${((sceneIndex + 1) / scenes.length) * 100}%` }} /></div><span>{sceneIndex + 1}/{scenes.length}</span></div>
              <div className="chapter-row"><div><small>{scene.time}</small><strong>{scene.location}</strong></div><span>{scene.chapter}</span></div>
              <div className="trip-track" aria-label={`Stop ${sceneIndex + 1} of ${scenes.length}: ${scene.location}`}>{scenes.map((stop, index) => <span key={stop.stamp} className={index < sceneIndex ? 'done' : index === sceneIndex ? 'current' : ''} title={stop.location}>{index + 1}</span>)}</div>
              <div className="speaker-art" style={{ background: scene.color }}><span>{scene.glyph}</span><em>{scene.stamp}</em><i>{scene.character}</i></div>
              <div className="dialogue-card">
                <p className="speaker">{scene.character}</p><h2>{scene.kannada}</h2><p className="roman-line">{scene.roman} · {scene.translation}</p><p>{scene.narration}</p>
              </div>
              {!result ? <div className="choices" aria-label="Choose your response">
                {scene.choices.map((choice, index) => <button className={`choice-button ${index === 1 ? 'hot' : ''}`} key={choice.kn} onClick={() => choose(choice)}><span><b>{choice.kn}</b><small>{choice.roman} · {choice.english}</small></span><span>0{index + 1}</span></button>)}
              </div> : <div className="result-card" aria-live="polite"><span className="result-stamp">CONSEQUENCE</span><p>{result.text}</p><div className="impact-row">{result.impacts.map((impact) => <b key={impact}>{impact}</b>)}<b>+1 PHRASE</b></div><button className="primary-button compact" onClick={advanceStory}><span>{sceneIndex === scenes.length - 1 ? 'SEE YOUR ENDING' : 'KEEP MOVING'}</span><span className="button-arrow">→</span></button></div>}
            </div>
          );
        })()}

        {screen === 'kaapi' && (
          <div className="mini-screen kaapi-screen screen-enter">
            <div className="mini-kicker">ARCADE BREAK · MADDUR</div><h2>KAAPI<br /><i>PANIC</i></h2><p className="mini-intro">The highway crew needs the perfect pull. Tap the steel tumbler fast enough to build foam before the red bus leaves.</p>
            <div className="timer-row"><strong>{kaapiTime}s</strong><span>{kaapiFill}% FOAM</span></div>
            <button className={`kaapi-machine ${kaapiActive ? 'is-active' : ''}`} onClick={tapKaapi} disabled={!kaapiActive} aria-label="Tap to pull filter coffee">
              <span className="coffee-stream" /><span className="steel-cup"><i style={{ height: `${Math.max(12, kaapiFill)}%` }} /><b>☕</b></span><span className="tap-burst">TAP!</span>
            </button>
            {!kaapiActive && !kaapiDone && <button className="primary-button" onClick={beginKaapi}><span>START POURING</span><span className="button-arrow">8s</span></button>}
            {kaapiDone && <div className="mini-result"><b>{kaapiFill >= 100 ? 'FULL FROTH. ZERO FEAR.' : 'A LITTLE FLAT. STILL COFFEE.'}</b><p>{kaapiFill >= 100 ? 'Shankar calls it “acceptable,” which is apparently five stars.' : 'Shankar quietly fixes it while maintaining eye contact.'}</p><button className="primary-button" onClick={claimKaapi}><span>SERVE IT</span><span className="button-arrow">→</span></button></div>}
          </div>
        )}

        {screen === 'blitz' && (
          <div className="mini-screen blitz-screen screen-enter">
            <div className="mini-kicker">ARCADE BREAK · HAMPI BAZAAR</div><h2>BARGAIN<br /><i>BLITZ</i></h2><p className="mini-intro">The bus leaves in fifteen seconds. Pick the line that gets the job done. Instinct beats grammar.</p>
            <div className="blitz-board">
              {!blitzActive && !blitzDone ? <div className="ready-card"><span>4 DEALS</span><b>15 SECONDS</b><small>Bad choices are still choices.</small></div> : !blitzDone ? <>
                <div className="timer-row"><strong>{blitzTime}s</strong><span>DEAL {blitzRound + 1}/4 · {blitzScore} WON</span></div>
                <div className="market-prompt"><span>THE SITUATION</span><p>{blitzRounds[blitzRound].prompt}</p></div>
                <div className={`blitz-options ${blitzFeedback ?? ''}`}>{blitzRounds[blitzRound].options.map((option, index) => <button key={option} onClick={() => pickBlitz(index)} disabled={!!blitzFeedback}><span>{option}</span><b>0{index + 1}</b></button>)}</div>
              </> : <div className="score-poster"><span>FINAL SCORE</span><b>{blitzScore}/4</b><p>{blitzScore >= 3 ? 'Lakshmi gives you the local price.' : 'You paid the “nice shoes” tax.'}</p></div>}
            </div>
            {!blitzActive && !blitzDone && <button className="primary-button" onClick={beginBlitz}><span>ENTER THE MARKET</span><span className="button-arrow">↗</span></button>}
            {blitzDone && <button className="primary-button" onClick={claimBlitz}><span>TAKE THE DEAL</span><span className="button-arrow">→</span></button>}
          </div>
        )}

        {screen === 'yaksha' && (
          <div className="mini-screen yaksha-screen screen-enter">
            <div className="mini-kicker">ARCADE BREAK · COASTAL KARNATAKA</div><h2>YAKSHA<br /><i>BEAT</i></h2><p className="mini-intro">Follow the drummer’s syllables. Tap the matching beat before the backstage curtain rises.</p>
            <div className="yaksha-stage">
              {!yakshaActive && !yakshaDone ? <div className="yaksha-mask" aria-hidden="true"><span>ತಾಳ</span><i /><b>12 SEC</b></div> : !yakshaDone ? <>
                <div className="timer-row"><strong>{yakshaTime}s</strong><span>BEAT {yakshaStep + 1}/8 · {yakshaScore} CLEAN</span></div>
                <div className={`beat-call ${yakshaFeedback ?? ''}`}><span>PLAY THIS</span><b>{beatSequence[yakshaStep]}</b></div>
                <div className="drum-pad">{['ಧಿ', 'ನಾ', 'ತೋಂ', 'ತಾ'].map((beat) => <button key={beat} onClick={() => tapBeat(beat)} disabled={!!yakshaFeedback}><span>{beat}</span><small>TAP</small></button>)}</div>
              </> : <div className="score-poster"><span>RHYTHM SCORE</span><b>{yakshaScore}/8</b><p>{yakshaScore >= 6 ? 'Keshava gives you a backstage nod. This is a major diplomatic victory.' : 'Your timing was experimental. The troupe applauds the confidence.'}</p></div>}
            </div>
            {!yakshaActive && !yakshaDone && <button className="primary-button" onClick={beginYaksha}><span>FOLLOW THE DRUMS</span><span className="button-arrow">♪</span></button>}
            {yakshaDone && <button className="primary-button" onClick={claimYaksha}><span>TAKE A BOW</span><span className="button-arrow">→</span></button>}
          </div>
        )}

        {screen === 'ending' && (
          <div className="ending-screen screen-enter" style={{ '--ending': ending.color } as React.CSSProperties}>
            <div className="ending-badge">{ending.badge}</div><div className="ending-glyph">{ending.glyph}</div><p className="eyebrow">KARNATAKA CROSSED. TROPHY DELIVERED.</p><h2>{ending.title}</h2><p className="ending-copy">{ending.copy}</p>
            <div className="score-grid four"><div><b>{stats.vibe}</b><span>VIBE</span></div><div><b>{stats.chaos}</b><span>CHAOS</span></div><div><b>{souvenirs.length}</b><span>LOOT</span></div><div><b>{phrases.length}</b><span>PHRASES</span></div></div>
            <div className="souvenir-reel">{souvenirs.slice(-5).map((item) => <span key={item}>{item}</span>)}</div>
            <div className="verdict"><span>OFFICIAL VERDICT</span><p>You learned just enough Kannada to create a much better road trip.</p></div>
            <button className="primary-button" onClick={shareEnding}><span>{shared ? 'RESULT COPIED ✓' : 'SHARE YOUR DAMAGE'}</span><span className="button-arrow">↗</span></button>
            <button className="secondary-button" onClick={startFresh}>PLAY AGAIN <span>↻</span></button>
          </div>
        )}

        {isPlaying && <button className="stash-fab" onClick={() => { setStashTab('passport'); setStashOpen(true); }} aria-label={`Open Karnataka passport with ${souvenirs.length} souvenirs`}><span>KA</span><b>{souvenirs.length}</b></button>}

        {stashOpen && <div className="modal-backdrop" role="presentation" onClick={() => setStashOpen(false)}><aside className="stash-drawer" role="dialog" aria-modal="true" aria-label="Karnataka chaos passport" onClick={(event) => event.stopPropagation()}><div className="drawer-handle" /><div className="stash-header"><div><span>ನಮ್ಮ ಕರ್ನಾಟಕ</span><h2>CHAOS PASSPORT</h2></div><button onClick={() => setStashOpen(false)} aria-label="Close passport">×</button></div><div className="stash-tabs" role="tablist"><button className={stashTab === 'passport' ? 'active' : ''} onClick={() => setStashTab('passport')} role="tab">STAMPS + LOOT</button><button className={stashTab === 'phrases' ? 'active' : ''} onClick={() => setStashTab('phrases')} role="tab">PHRASES · {phrases.length}</button></div>
          {stashTab === 'passport' ? <><p className="stash-copy">Ten wildly optimistic stops. Geography has filed a complaint.</p><div className="passport-stamps">{scenes.map((scene, index) => <div className={index <= sceneIndex ? 'visited' : ''} key={scene.stamp}><span>{index < 9 ? `0${index + 1}` : index + 1}</span><b>{scene.stamp}</b><small>{scene.location}</small></div>)}</div><h3 className="loot-title">SOUVENIR POCKET · {souvenirs.length}</h3><div className="loot-grid">{souvenirs.length ? souvenirs.map((item, index) => <div key={item}><span>{['◆','✦','●','▲'][index % 4]}</span><p>{item}</p></div>) : <p className="empty-loot">Make your first questionable choice to collect something.</p>}</div></> : <><p className="stash-copy">Things you can now confidently say, with no guarantee you should.</p><div className="phrase-list">{phrases.map((phrase, index) => <div className="phrase-card" key={phrase.kn}><span>{index + 1}</span><div><b>{phrase.kn}</b><small>{phrase.roman}</small><p>{phrase.english}</p></div></div>)}</div></>}
        </aside></div>}
      </section>
    </main>
  );
}
