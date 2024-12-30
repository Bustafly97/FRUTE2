import React, { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';
import { translateText } from '../utils/translations';
import { TranslationLoader } from './TranslationLoader';
import { SaveButton } from './SaveButton';

interface TranslationPanelProps {
  text: string;
  onSave: (original: string, translation: string) => void;
}

export function TranslationPanel({ text, onSave }: TranslationPanelProps) {
  const [translation, setTranslation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function performTranslation() {
      if (!text?.trim()) {
        setTranslation('');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await translateText(text);
        if (mounted) {
          setTranslation(result);
        }
      } catch (err) {
        if (mounted) {
          setError('Error al traducir el texto. Por favor, inténtalo de nuevo.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    performTranslation();

    return () => {
      mounted = false;
    };
  }, [text]);

  const handleSave = () => {
    if (text && translation) {
      onSave(text, translation);
    }
  };

  if (!text) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-lg border border-gray-200">
        <Languages className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-gray-500">Selecciona texto para traducir</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Texto Original</h3>
        <p className="text-gray-800">{text}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Traducción al Español</h3>
        {loading ? (
          <TranslationLoader />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-gray-800">{translation}</p>
        )}
      </div>
      {translation && !loading && !error && (
        <SaveButton onClick={handleSave} />
      )}
    </div>
  );
}