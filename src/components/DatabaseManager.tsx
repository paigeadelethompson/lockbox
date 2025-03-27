import React, { useState, useEffect } from 'react';
import { DatabaseHistory, DatabaseOptions, databaseService } from '../services/databaseService';
import { kdbxService } from '../services/kdbxService';
import { DatabaseForm } from './DatabaseForm';
import { DatabaseList } from './DatabaseList';

interface DatabaseManagerProps {
  onDatabaseSelect: (options: DatabaseOptions) => void;
  onDatabaseCreate: (options: DatabaseOptions) => Promise<void>;
  showCreateForm?: boolean;
}

export const DatabaseManager: React.FC<DatabaseManagerProps> = ({
  onDatabaseSelect,
  onDatabaseCreate,
  showCreateForm = false,
}) => {
  const [databaseHistory, setDatabaseHistory] = useState<DatabaseHistory[]>([]);
  const defaultNewDatabaseOptions: DatabaseOptions = {
    name: '',
    password: '',
    keyDerivation: 'PBKDF2' as const,
    iterations: 100000,
    memory: 64,
    parallelism: 1,
    hardwareKey: false,
    algorithm: 'AES' as const
  };
  const [newDatabaseOptions, setNewDatabaseOptions] = useState<DatabaseOptions>(defaultNewDatabaseOptions);

  useEffect(() => {
    loadDatabaseHistory();
  }, []);

  const loadDatabaseHistory = async () => {
    const history = await databaseService.getDatabaseHistory();
    setDatabaseHistory(history);
  };

  const handleCreateDatabase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onDatabaseCreate(newDatabaseOptions);
      setNewDatabaseOptions(defaultNewDatabaseOptions);
    } catch (error) {
      console.error('Failed to create database:', error);
    }
  };

  const handleKeyFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewDatabaseOptions(prev => ({
        ...prev,
        keyFile: file.name,
      }));
    }
  };

  const handleRemoveDatabase = async (path: string) => {
    await databaseService.removeFromHistory(path);
    loadDatabaseHistory();
  };

  return (
    <div className="space-y-6">
      {showCreateForm ? (
        <DatabaseForm onSubmit={handleCreateDatabase} />
      ) : (
        <DatabaseList onSelect={onDatabaseSelect} />
      )}
    </div>
  );
}; 