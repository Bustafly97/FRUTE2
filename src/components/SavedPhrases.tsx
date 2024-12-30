import React, { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface SavedPhrase {
  phrase: string;
  translation: string;
}

interface SavedPhrasesProps {
  phrases: SavedPhrase[];
  onUpdatePhrase: (oldPhrase: string, newPhrase: string, newTranslation: string) => void;
}

interface EditingState {
  phrase: string;
  translation: string;
}

export function SavedPhrases({ phrases, onUpdatePhrase }: SavedPhrasesProps) {
  const [editingPhrase, setEditingPhrase] = useState<string | null>(null);
  const [editingState, setEditingState] = useState<EditingState>({ phrase: '', translation: '' });

  const handleEditClick = (phrase: SavedPhrase) => {
    setEditingPhrase(phrase.phrase);
    setEditingState({
      phrase: phrase.phrase,
      translation: phrase.translation
    });
  };

  const handleSaveEdit = (originalPhrase: string) => {
    if (editingState.phrase.trim() && editingState.translation.trim()) {
      onUpdatePhrase(originalPhrase, editingState.phrase, editingState.translation);
      setEditingPhrase(null);
      setEditingState({ phrase: '', translation: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingPhrase(null);
    setEditingState({ phrase: '', translation: '' });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Saved Phrases</h2>
      <div className="space-y-2">
        {phrases.map((phrase) => (
          <div
            key={phrase.phrase}
            className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
          >
            {editingPhrase === phrase.phrase ? (
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phrase
                  </label>
                  <input
                    type="text"
                    value={editingState.phrase}
                    onChange={(e) => setEditingState(prev => ({ ...prev, phrase: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Translation
                  </label>
                  <input
                    type="text"
                    value={editingState.translation}
                    onChange={(e) => setEditingState(prev => ({ ...prev, translation: e.target.value }))}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(phrase.phrase)}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors"
                  >
                    <Check size={14} />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400 transition-colors"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-800">{phrase.phrase}</p>
                  <button
                    onClick={() => handleEditClick(phrase)}
                    className="text-blue-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{phrase.translation}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}