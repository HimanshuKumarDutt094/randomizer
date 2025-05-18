// Types for random word API

export type WordCategory =
  | "animals"
  | "birds"
  | "fish"
  | "fruits"
  | "vegetables"
  | "objects";

export type PartOfSpeech = "noun" | "verb";

export interface WordEntry {
  name: string;
  category?: WordCategory | string;
  partOfSpeech?: PartOfSpeech | string;
}

export type JsonWordEntry = Record<string, any> & { name: string };

export interface RandomWordResponse {
  word: string;
  category?: WordCategory;
  partOfSpeech?: PartOfSpeech;
}
