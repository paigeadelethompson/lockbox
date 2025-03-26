import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Entry } from "../types/Entry";
import { kdbxService } from "../services/kdbxService";

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { masterPassword, setMasterPassword } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, [masterPassword]);

  const loadEntries = async () => {
    try {
      setIsLoading(true);
      const loadedEntries = await kdbxService.getEntries();
      setEntries(loadedEntries);
    } catch (error) {
      console.error("Error loading entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = () => {
    navigate("/add-entry");
  };

  const handleViewEntry = (id: string) => {
    navigate(`/view-entry/${id}`);
  };

  const handleLock = () => {
    setMasterPassword('');
    navigate("/");
  };

  const filteredEntries = entries.filter((entry) =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Passwords</h1>
        <div className="flex gap-4">
          <button
            onClick={handleLock}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Lock Database
          </button>
          <button
            onClick={handleAddEntry}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Entry
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search entries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid gap-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => handleViewEntry(entry.id)}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{entry.title}</h2>
                <p className="text-gray-600">{entry.username}</p>
              </div>
              <div className="text-gray-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No entries found. Add your first password entry!
        </div>
      )}
    </div>
  );
};

export default HomeScreen; 