import React, { useState } from 'react';
import { DatabaseOptions } from '../services/databaseService';

interface DatabaseFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const DatabaseForm: React.FC<DatabaseFormProps> = ({ onSubmit }) => {
  const [options, setOptions] = useState<DatabaseOptions>({
    name: '',
    password: '',
    algorithm: 'AES',
    keyDerivation: 'PBKDF2',
    iterations: 100000,
    memory: 32,
    parallelism: 2,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-medium text-gray-100">Create New Database</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-300">Database Name</label>
        <input
          type="text"
          value={options.name}
          onChange={(e) => setOptions(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Password</label>
        <input
          type="password"
          value={options.password}
          onChange={(e) => setOptions(prev => ({ ...prev, password: e.target.value }))}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300">Encryption Algorithm</label>
        <select
          value={options.algorithm}
          onChange={(e) => setOptions(prev => ({ ...prev, algorithm: e.target.value as 'AES' | 'ChaCha20' }))}
          className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
        >
          <option value="AES">AES</option>
          <option value="ChaCha20">ChaCha20</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Iterations</label>
          <input
            type="number"
            value={options.iterations}
            onChange={(e) => setOptions(prev => ({ ...prev, iterations: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Memory (MB)</label>
          <input
            type="number"
            value={options.memory}
            onChange={(e) => setOptions(prev => ({ ...prev, memory: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Parallelism</label>
          <input
            type="number"
            value={options.parallelism}
            onChange={(e) => setOptions(prev => ({ ...prev, parallelism: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Create Database
        </button>
      </div>
    </form>
  );
}; 