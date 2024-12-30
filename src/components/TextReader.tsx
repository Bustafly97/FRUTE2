import React, { useState } from 'react';
import { FileText, Clipboard, Save, Book } from 'lucide-react';
import { HighlightedText } from './HighlightedText';
import { SavedTextsModal } from './SavedTextsModal';
import { SavedText } from '../types/savedText';
import { getSavedTexts, saveText, deleteText } from '../utils/storage';

interface TextReaderProps {
  text: string;
  savedPhrases: Array<{ phrase: string; translation: string }>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTextSelection: (event: React.MouseEvent) => void;
  onRemoveHighlight?: (phrase: string) => void;
  onTextPaste: () => void;
  onTextChange: (text: string) => void;
}

export function TextReader({ 
  text, 
  savedPhrases, 
  onFileChange, 
  onTextSelection,
  onRemoveHighlight,
  onTextPaste,
  onTextChange
}: TextReaderProps) {
  const [showModal, setShowModal] = useState(false);
  const [savedTexts, setSavedTexts] = useState<SavedText[]>(() => getSavedTexts());

  const translations = savedPhrases.reduce((acc, { phrase, translation }) => {
    acc[phrase] = translation;
    return acc;
  }, {} as { [key: string]: string });

  const handleSaveText = () => {
    if (!text.trim()) return;
    
    const title = prompt('Enter a title for this text:');
    if (!title) return;

    const newText = saveText(title, text);
    setSavedTexts([...savedTexts, newText]);
  };

  const handleDeleteText = (id: string) => {
    deleteText(id);
    setSavedTexts(savedTexts.filter(text => text.id !== id));
  };

  const handleSelectText = (savedText: SavedText) => {
    onTextChange(savedText.content);
    setShowModal(false);
  };
  
  return (
    <div className="w-1/2 p-6 border-r border-gray-200 bg-white overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Text Reader</h1>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
            <FileText size={20} />
            <span>Select File</span>
            <input
              type="file"
              accept=".txt"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
          <button
            onClick={onTextPaste}
            className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Clipboard size={20} />
            <span>Paste Text</span>
          </button>
          <button
            onClick={handleSaveText}
            disabled={!text.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            <span>Save Text</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <Book size={20} />
            <span>My Texts</span>
          </button>
        </div>
      </div>

      <div
        onMouseUp={onTextSelection}
        className="whitespace-pre-wrap text-gray-700 leading-relaxed"
      >
        <HighlightedText 
          text={text} 
          highlightedPhrases={savedPhrases.map(p => p.phrase)}
          translations={translations}
          onRemoveHighlight={onRemoveHighlight}
        />
      </div>

      {showModal && (
        <SavedTextsModal
          texts={savedTexts}
          onClose={() => setShowModal(false)}
          onSelect={handleSelectText}
          onDelete={handleDeleteText}
        />
      )}
    </div>
  );
}