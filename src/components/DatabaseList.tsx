import React, { useState, useEffect } from 'react';
import { DatabaseHistory, DatabaseOptions, databaseService } from '../services/databaseService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface DatabaseListProps {
  onSelect: (options: DatabaseOptions) => void;
}

export const DatabaseList: React.FC<DatabaseListProps> = ({ onSelect }) => {
  const [databases, setDatabases] = useState<DatabaseHistory[]>([]);

  useEffect(() => {
    const loadDatabases = async () => {
      const history = await databaseService.getDatabaseHistory();
      setDatabases(history);
    };
    loadDatabases();
  }, []);

  const handleRemove = async (path: string) => {
    await databaseService.removeFromHistory(path);
    setDatabases(prev => prev.filter(db => db.path !== path));
  };

  if (databases.length === 0) {
    return (
      <div className="text-center text-gray-400">
        No databases found. Create your first database to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {databases.map((database) => (
        <div
          key={database.path}
          className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
        >
          <div>
            <h3 className="font-medium text-gray-100">{database.name}</h3>
            <p className="text-sm text-gray-400">
              Last opened: {new Date(database.lastOpened).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSelect({
                name: database.name,
                password: '',
                path: database.path,
              })}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Open
            </button>
            <button
              onClick={() => handleRemove(database.path)}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 