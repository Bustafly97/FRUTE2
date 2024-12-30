import React, { useState } from 'react';
import { X } from 'lucide-react';

interface HighlightedTextProps {
  text: string;
  highlightedPhrases: string[];
  translations?: { [key: string]: string };
  onRemoveHighlight?: (phrase: string) => void;
}

export function HighlightedText({ 
  text, 
  highlightedPhrases,
  translations = {},
  onRemoveHighlight
}: HighlightedTextProps) {
  const [tooltip, setTooltip] = useState({
    show: false,
    text: '',
    currentPhrase: '',
    showUnhighlight: false
  });

  if (!text || !highlightedPhrases.length) return <>{text}</>;

  const handleMouseEnter = (e: React.MouseEvent, phrase: string) => {
    const translation = translations[phrase];
    if (translation) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setTooltip({
        show: true,
        text: translation,
        currentPhrase: phrase,
        showUnhighlight: tooltip.showUnhighlight
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({
      ...prev,
      show: false
    }));
  };

  const handleClick = (phrase: string) => {
    setTooltip(prev => ({
      ...prev,
      currentPhrase: phrase,
      showUnhighlight: !prev.showUnhighlight || prev.currentPhrase !== phrase
    }));
  };

  const parts = text.split(new RegExp(`(${highlightedPhrases.join('|')})`, 'gi'));

  return (
    <>
      {parts.map((part, i) => {
        const isHighlighted = highlightedPhrases.some(
          phrase => phrase.toLowerCase() === part.toLowerCase()
        );
        
        return isHighlighted ? (
          <mark 
            key={i} 
            className="bg-yellow-200 rounded px-1 cursor-pointer relative group"
            onMouseEnter={(e) => handleMouseEnter(e, part)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(part)}
          >
            {part}
            {tooltip.show && tooltip.currentPhrase.toLowerCase() === part.toLowerCase() && (
              <div
                className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-gray-800 text-white px-2 py-1 rounded text-sm"
                style={{
                  top: '-10px',
                  whiteSpace: 'nowrap',
                  zIndex: 50
                }}
              >
                <em className="font-bold">{translations[part]}</em>
              </div>
            )}
            {tooltip.showUnhighlight && tooltip.currentPhrase.toLowerCase() === part.toLowerCase() && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRemoveHighlight) {
                    onRemoveHighlight(part);
                    setTooltip(prev => ({
                      ...prev,
                      showUnhighlight: false
                    }));
                  }
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors shadow-sm"
                style={{ zIndex: 51 }}
              >
                <X size={12} />
              </button>
            )}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}