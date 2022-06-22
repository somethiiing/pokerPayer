export interface AppData {
  timestamp: Date;
  games: {
    [key: string]: Game; // gameUuid of game will be key
  };
}

export interface Game {
  timestamp: Date;
  // gameUuid: string;
  gameCode: string; // randomly generated 4 letter string, or fruit, or something
  pending: TransactionEntry[];
  transations: TransactionEntry[];
  currentCashTotal: number; // currentCashTotal === buyInTotal - cashOutTotal
  buyInTotal: number;
  cashOutTotal: number;
  physicalCash: number;
  players: {
    [key: string]: Player; // playerUuid of game will be key
  }
  payments: Payment[]
}

export interface TransactionEntry {
  time: Date;
  player: string;
  amount: number;
  transactionType: TransactionType;
  approved: boolean;
}

export interface Player {
  joinTime: Date;
  venmoId: string;
  // playerUuid: string;
  fbId: string; // whatever fb's identifier is
  displayName: string; // display name
  buyInTotal: number;
  cashOutTotal: number;
  endBalance: number; // endBalance === cashOutTotal - buyInTotal. if endBalance is POSITIVE, then receive money. if NEGATIVE, they send money
  recentTransaction: TransactionEntry;
  isSettled: boolean;
  payments?: Payment[];
}

export interface Payment {
  sender: string; // can be 'banker'
  receiver: string;
  value: number;
  isCash: boolean;
}

export enum TransactionType {
  buyIn = 'BUYIN',
  cashOut = 'CASHOUT'
}