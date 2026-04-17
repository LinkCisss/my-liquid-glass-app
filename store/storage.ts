import AsyncStorage from '@react-native-async-storage/async-storage';

export type Sentiment = 'bullish' | 'bearish' | 'neutral';

export interface StockReviewRecord {
  id: string; // e.g., UUID or timestamp
  date: string; // ISO string 2024-05-12T...
  content: string;
  sentiment: Sentiment;
}

export interface StockReview {
  stockCode: string; // e.g., AAPL or 00700
  stockName: string;
  records: StockReviewRecord[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
}

const STOCKS_KEY = '@stocks_reviews';
const NOTES_KEY = '@market_notes';

// --- Stocks ---
export const getStocks = async (): Promise<StockReview[]> => {
  try {
    const data = await AsyncStorage.getItem(STOCKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to fetch stocks', e);
    return [];
  }
};

export const saveStocks = async (stocks: StockReview[]) => {
  try {
    await AsyncStorage.setItem(STOCKS_KEY, JSON.stringify(stocks));
  } catch (e) {
    console.error('Failed to save stocks', e);
  }
};

export const addStockRecord = async (
  stockCode: string,
  stockName: string,
  record: Omit<StockReviewRecord, 'id' | 'date'>
) => {
  const stocks = await getStocks();
  let stockIndex = stocks.findIndex((s) => s.stockCode === stockCode);
  
  if (stockIndex === -1) {
    stocks.push({ stockCode, stockName, records: [] });
    stockIndex = stocks.length - 1;
  }

  stocks[stockIndex].records.unshift({
    ...record,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  });

  await saveStocks(stocks);
};

// --- Notes ---
export const getNotes = async (): Promise<Note[]> => {
  try {
    const data = await AsyncStorage.getItem(NOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to fetch notes', e);
    return [];
  }
};

export const saveNotes = async (notes: Note[]) => {
  try {
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error('Failed to save notes', e);
  }
};

export const addNote = async (title: string, content: string, tags: string[] = []) => {
  const notes = await getNotes();
  notes.unshift({
    id: Date.now().toString(),
    title,
    content,
    tags,
    date: new Date().toISOString(),
  });
  await saveNotes(notes);
};
