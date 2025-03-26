import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Entry } from '../types/Entry';
import { kdbxService } from '../services/kdbxService';
import { TOTPDisplay } from '../components/TOTPDisplay';

const ViewEntryScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { masterPassword } = useAuth();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    loadEntry();
  }, [id, masterPassword]);

  const loadEntry = async () => {
    try {
      setIsLoading(true);
      const entries = await kdbxService.getEntries();
      const foundEntry = entries.find((e) => e.id === id);
      if (foundEntry) {
        setEntry(foundEntry);
      }
    } catch (error) {
      console.error("Error loading entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleDelete = async () => {
    if (!entry) return;
    try {
      await kdbxService.deleteEntry(entry.id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Entry not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{entry.title}</h1>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <button
                onClick={() => handleCopy(entry.username, "username")}
                className="text-blue-500 hover:text-blue-600"
              >
                {copiedField === "username" ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="font-mono">{entry.username}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <button
                onClick={() => handleCopy(entry.password, "password")}
                className="text-blue-500 hover:text-blue-600"
              >
                {copiedField === "password" ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="font-mono">••••••••</div>
          </div>

          {entry.url && (
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">URL</label>
                <button
                  onClick={() => handleCopy(entry.url!, "url")}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {copiedField === "url" ? "Copied!" : "Copy"}
                </button>
              </div>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                {entry.url}
              </a>
            </div>
          )}

          {entry.notes && (
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <button
                  onClick={() => handleCopy(entry.notes!, "notes")}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {copiedField === "notes" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="whitespace-pre-wrap">{entry.notes}</div>
            </div>
          )}

          {entry.totp && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Two-Factor Authentication</h2>
              <TOTPDisplay entry={entry} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEntryScreen; 