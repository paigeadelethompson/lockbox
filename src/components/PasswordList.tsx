import React, { useState } from "react";
import { PasswordEntry } from "../types/password";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCopy, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';

interface PasswordListProps {
  entries: PasswordEntry[];
  onEdit: (entry: PasswordEntry) => void;
  onDelete: (id: string) => void;
}

export const PasswordList: React.FC<PasswordListProps> = ({
  entries,
  onEdit,
  onDelete,
}) => {
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});

  const togglePasswordVisibility = (id: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getEntryIcon = (iconName: string) => {
    return findIconDefinition({ prefix: 'fas', iconName: iconName as any }) || solidIcons.faKey;
  };

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="card p-4 hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon 
                icon={getEntryIcon(entry.icon || 'key')} 
                className="text-xl text-blue-500"
              />
              <div>
                <h3 className="text-lg font-semibold text-slate-100">
                  {entry.title}
                </h3>
                <p className="text-sm text-slate-400">{entry.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => togglePasswordVisibility(entry.id)}
                className="text-slate-400 hover:text-slate-300"
              >
                <FontAwesomeIcon
                  icon={showPassword[entry.id] ? faEyeSlash : faEye}
                />
              </button>
              <button
                onClick={() => copyToClipboard(entry.password)}
                className="text-slate-400 hover:text-slate-300"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
              <button
                onClick={() => onEdit(entry)}
                className="text-slate-400 hover:text-slate-300"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                onClick={() => onDelete(entry.id)}
                className="text-slate-400 hover:text-slate-300"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>

          {showPassword[entry.id] && (
            <div className="mt-2 p-2 bg-slate-800 rounded">
              <code className="text-sm text-slate-300">{entry.password}</code>
            </div>
          )}

          {entry.url && (
            <div className="mt-2">
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {entry.url}
              </a>
            </div>
          )}

          {entry.notes && (
            <div className="mt-2 text-sm text-slate-400">{entry.notes}</div>
          )}
        </div>
      ))}
    </div>
  );
}; 