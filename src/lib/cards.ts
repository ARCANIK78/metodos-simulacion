export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface CardData {
  suit: Suit;
  rank: Rank;
  id: number;
}

export interface JokerCard {
  isJoker: true;
  id: number;
}

export type AnyCard = CardData | JokerCard;

export const SUITS: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
export const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J" as Rank, "Q", "K"];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

export const getSuitSymbol = (suit: Suit): string => SUIT_SYMBOLS[suit];

export const isRedSuit = (suit: Suit): boolean => {
  return suit === "hearts" || suit === "diamonds";
};

export const isJoker = (card: AnyCard): card is JokerCard => {
  return "isJoker" in card && card.isJoker === true;
};

export const generateRandomCard = (id: number): CardData => {
  const randomSuit = SUITS[Math.floor(Math.random() * SUITS.length)];
  const randomRank = RANKS[Math.floor(Math.random() * RANKS.length)];
  return { suit: randomSuit, rank: randomRank, id };
};

export const generateRandomCardWithJoker = (id: number, jokerChance: number = 0.1): AnyCard => {
  if (Math.random() < jokerChance) {
    return { isJoker: true, id };
  }
  return generateRandomCard(id);
};

export const generateCards = (count: number, withJoker: boolean = false, jokerChance: number = 0.1): AnyCard[] => {
  if (withJoker) {
    return Array.from({ length: count }, (_, i) => generateRandomCardWithJoker(i, jokerChance));
  }
  return Array.from({ length: count }, (_, i) => generateRandomCard(i));
};

export const CARDS_PER_ROUND = 4;
