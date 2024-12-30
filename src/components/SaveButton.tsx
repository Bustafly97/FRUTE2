import React from 'react';
import { Save } from 'lucide-react';

interface SaveButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function SaveButton({ onClick, disabled }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Save size={20} />
      <span>Guardar traducción</span>
    </button>
  );
}