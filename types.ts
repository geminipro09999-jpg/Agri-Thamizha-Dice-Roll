export interface GameEvent {
  sq: number;
  text: string;
  sound: 'neutral' | 'success' | 'sad' | 'suspense' | 'nature' | 'victory';
  img: string;
}

export interface Player {
  id: number;
  name: string;
  display: string;
  color: string;
  avatar: string;
  pos: number;
  sixCount: number;
  events: GameEvent[];
}

export interface BoardConfig {
  bgImage: string;
  wallpaper: string;
  cellSize: number;
  cellUnit: 'px' | 'mm' | 'cm';
  boardPadding: number;
  scale: number;
  x: number;
  y: number;
}

export interface LogicMap {
  [key: number]: number;
}

export interface SaveData {
  players: Player[];
  logic: LogicMap;
  boardConfig: BoardConfig;
}