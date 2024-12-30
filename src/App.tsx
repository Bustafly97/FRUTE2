import React, { useState } from 'react';
import { TextReader } from './components/TextReader';
import { SelectionPopup } from './components/SelectionPopup';
import { TranslationPanel } from './components/TranslationPanel';
import { SavedPhrases } from './components/SavedPhrases';

interface SavedPhrase {
  phrase: string;
  translation: string;
}

function App() {
  const [text, setText] = useState<string>('');
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>(() => {
    const saved = localStorage.getItem('savedPhrases');
    return saved ? JSON.parse(saved) : [];
  });
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const [selectedForTranslation, setSelectedForTranslation] = useState<string>('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleTextPaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      alert('Unable to paste text. Please check clipboard permissions.');
    }
  };

  const handleTextSelection = (event: React.MouseEvent) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selectedText) {
      setSelection(null);
      return;
    }

    const range = selection?.getRangeAt(0);
    const rect = range?.getBoundingClientRect();

    if (rect) {
      setSelection({
        text: selectedText,
        x: event.clientX,
        y: rect.top + window.scrollY
      });
    }
  };

  const handleCopy = async () => {
    if (selection?.text) {
      await navigator.clipboard.writeText(selection.text);
      setSelection(null);
    }
  };

  const handleSave = () => {
    if (selection?.text) {
      const translation = prompt('Enter translation:', '');
      if (translation) {
        savePhrase(selection.text, translation);
      }
      setSelection(null);
    }
  };

  const handleTranslate = () => {
    if (selection?.text) {
      setSelectedForTranslation(selection.text);
      setSelection(null);
    }
  };

  const handleUpdatePhrase = (oldPhrase: string, newPhrase: string, newTranslation: string) => {
    const updatedPhrases = savedPhrases.map(item => 
      item.phrase === oldPhrase 
        ? { phrase: newPhrase, translation: newTranslation }
        : item
    );
    setSavedPhrases(updatedPhrases);
    localStorage.setItem('savedPhrases', JSON.stringify(updatedPhrases));
  };

  const handleRemoveHighlight = (phrase: string) => {
    const updatedPhrases = savedPhrases.filter(p => p.phrase !== phrase);
    setSavedPhrases(updatedPhrases);
    localStorage.setItem('savedPhrases', JSON.stringify(updatedPhrases));
  };

  const savePhrase = (phrase: string, translation: string) => {
    const existingIndex = savedPhrases.findIndex(p => p.phrase === phrase);
    
    let updatedPhrases;
    if (existingIndex >= 0) {
      updatedPhrases = savedPhrases.map((p, index) => 
        index === existingIndex ? { ...p, translation } : p
      );
    } else {
      updatedPhrases = [...savedPhrases, { phrase, translation }];
    }
    
    setSavedPhrases(updatedPhrases);
    localStorage.setItem('savedPhrases', JSON.stringify(updatedPhrases));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <TextReader
        text={text}
        savedPhrases={savedPhrases}
        onFileChange={handleFileChange}
        onTextSelection={handleTextSelection}
        onRemoveHighlight={handleRemoveHighlight}
        onTextPaste={handleTextPaste}
        onTextChange={setText}
      />

      {selection && (
        <SelectionPopup
          x={selection.x}
          y={selection.y}
          onCopy={handleCopy}
          onSave={handleSave}
          onTranslate={handleTranslate}
        />
      )}

      <div className="w-1/2 flex flex-col p-6 bg-gray-50">
        <div className="mb-6 flex-1">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Translator</h2>
          <TranslationPanel
            text={selectedForTranslation}
            onSave={savePhrase}
          />
        </div>

        <SavedPhrases 
          phrases={savedPhrases}
          onUpdatePhrase={handleUpdatePhrase}
        />
      </div>
    </div>
  );
}

export default App;