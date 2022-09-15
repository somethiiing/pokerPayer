export interface Game {
  timestamp: Date;
  group_id: string;
  players: {
    [key: string]: Player; // playerUuid of game will be key
  }
}

export interface Player {
  first_name: string;
  last_name: string;
  email: string;
  id: number;
}