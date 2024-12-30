import React from 'react';
import { X, Book } from 'lucide-react';
import { SavedText } from '../types/savedText';

interface SavedTextsModalProps {
  texts: SavedText[];
  onClose: () => void;
  onSelect: (text: SavedText) => void;
  onDelete: (id: string) => void;
}

export function SavedTextsModal({ texts, onClose, onSelect, onDelete }: SavedTextsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[600px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Saved Texts</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {texts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Book size={48} className="mx-auto mb-2 opacity-50" />
              <p>No saved texts yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {texts.map((text) => (
                <div
                  key={text.id}
                  className="border rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{text.title}</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelect(text)}
                        className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => onDelete(text.id)}
                        className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(text.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}