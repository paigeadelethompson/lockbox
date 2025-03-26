import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  className?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter icons based on search term
  const filteredIcons = Object.entries(solidIcons)
    .filter(([key]) => key.startsWith('fa') && key.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 50); // Limit to 50 icons for performance

  const currentIcon = findIconDefinition({ prefix: 'fas', iconName: value as any }) || solidIcons.faKey;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg hover:bg-slate-700 transition-colors ${className}`}
      >
        <FontAwesomeIcon icon={currentIcon} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <div className="p-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search icons..."
              className="input-field w-full mb-2"
            />
          </div>
          <div className="max-h-64 overflow-y-auto grid grid-cols-4 gap-2 p-2">
            {filteredIcons.map(([key, icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onChange(key.replace('fa', ''));
                  setIsOpen(false);
                }}
                className={`p-2 rounded-lg hover:bg-slate-700 transition-colors ${
                  key === `fa${value}` ? 'bg-blue-500 hover:bg-blue-600' : ''
                }`}
              >
                <FontAwesomeIcon icon={icon as IconDefinition} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 