import { SavedText } from '../types/savedText';

const SAVED_TEXTS_KEY = 'savedTexts';

export function getSavedTexts(): SavedText[] {
  const saved = localStorage.getItem(SAVED_TEXTS_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveText(title: string, content: string): SavedText {
  const texts = getSavedTexts();
  const newText: SavedText = {
    id: crypto.randomUUID(),
    title,
    content,
    createdAt: new Date().toISOString()
  };
  
  texts.push(newText);
  localStorage.setItem(SAVED_TEXTS_KEY, JSON.stringify(texts));
  return newText;
}

export function deleteText(id: string): void {
  const texts = getSavedTexts().filter(text => text.id !== id);
  localStorage.setItem(SAVED_TEXTS_KEY, JSON.stringify(texts));
}