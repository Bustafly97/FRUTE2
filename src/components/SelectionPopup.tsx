import React from 'react';
import { Copy, Save, Languages } from 'lucide-react';

interface SelectionPopupProps {
  x: number;
  y: number;
  onCopy: () => void;
  onSave: () => void;
  onTranslate: () => void;
}

export function SelectionPopup({ x, y, onCopy, onSave, onTranslate }: SelectionPopupProps) {
  return (
    <div
      className="fixed bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex flex-col gap-1 w-32"
      style={{
        left: `${x}px`,
        top: `${y + 20}px`
      }}
    >
      <button
        onClick={onCopy}
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded text-sm"
      >
        <Copy size={16} /> Copy
      </button>
      <button
        onClick={onSave}
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded text-sm"
      >
        <Save size={16} /> Save
      </button>
      <button
        onClick={onTranslate}
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded text-sm"
      >
        <Languages size={16} /> Translate
      </button>
    </div>
  );
}