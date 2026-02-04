import { Player, LogicMap, BoardConfig } from './types';

export const DEFAULT_LOGIC: LogicMap = { 
  8: 29, 20: 43, 54: 92, 61: 83, // Ladders
  23: 5, 45: 27, 94: 65 // Snakes
};

export const DEFAULT_PLAYERS: Player[] = [
  { id: 0, name: "Manickam", display: "மாணிக்கம்", color: "#e53935", avatar: "👨‍🌾", pos: 0, sixCount: 0, events: [{ sq: 8, text: "வங்கிக் கடன் கிடைத்தது! (Bank Loan)", sound: "success", img: "" }, { sq: 45, text: "'டிட்வா' புயல் தாக்குதல்!", sound: "sad", img: "" }, { sq: 61, text: "ஸ்மார்ட் ஃபார்மிங் தொழில்நுட்பம்!", sound: "success", img: "" }] },
  { id: 1, name: "Kavitha", display: "கவிதா", color: "#1e88e5", avatar: "👩‍🌾", pos: 0, sixCount: 0, events: [{ sq: 20, text: "மகளிர் சுய உதவிக் குழு உதவி!", sound: "success", img: "" }, { sq: 45, text: "பூச்சி தாக்குதல்! விளைச்சல் பாதிப்பு.", sound: "sad", img: "" }, { sq: 94, text: "எதிர்பாராத காலநிலை மாற்றம்!", sound: "suspense", img: "" }] },
  { id: 2, name: "Selvan", display: "செல்வன்", color: "#fb8c00", avatar: "👴", pos: 0, sixCount: 0, events: [{ sq: 8, text: "பாரம்பரிய நெல் சாகுபடி ஆரம்பம்.", sound: "nature", img: "" }, { sq: 45, text: "காட்டுப் பன்றிகள் தொல்லை!", sound: "suspense", img: "" }, { sq: 54, text: "மாப்பிள்ளை சம்பா அரிசி - வெற்றி!", sound: "success", img: "" }] },
  { id: 3, name: "Kathir", display: "கதிர்", color: "#8e24aa", avatar: "🧔", pos: 0, sixCount: 0, events: [{ sq: 23, text: "தண்ணீர் பற்றாக்குறை! (Water Scarcity)", sound: "sad", img: "" }, { sq: 45, text: "சந்தை விலை வீழ்ச்சி!", sound: "suspense", img: "" }] }
];

export const DEFAULT_BOARD_CONFIG: BoardConfig = {
  bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', // Fallback placeholder
  wallpaper: '',
  cellSize: 60,
  cellUnit: 'px',
  boardPadding: 0,
  scale: 100,
  x: 50,
  y: 50
};