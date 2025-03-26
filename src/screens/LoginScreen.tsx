import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { kdbxService } from "../services/kdbxService";
import { DatabaseManager } from "../components/DatabaseManager";
import { DatabaseOptions } from "../services/databaseService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faDatabase, faKey } from "@fortawesome/free-solid-svg-icons";
import { ProtectedValue, Credentials } from 'kdbxweb';
import { databaseService } from "../services/databaseService";

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setMasterPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<DatabaseOptions | null>(null);
  const [password, setPassword] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleDatabaseSelect = (options: DatabaseOptions) => {
    setSelectedDatabase(options);
    setShowPasswordPrompt(true);
  };

  const handleDatabaseCreate = async (options: DatabaseOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      // Show save file dialog in Electron
      if (window.electron) {
        const { dialog } = window.electron;
        const { filePath } = await dialog.showSaveDialog({
          title: 'Save Database',
          defaultPath: `${options.name}.kdbx`,
          filters: [{ name: 'KeePass Database', extensions: ['kdbx'] }]
        });
        
        if (!filePath) {
          throw new Error('No save location selected');
        }
        
        options.path = filePath;
      }

      await kdbxService.createNewDatabase(options);
      setMasterPassword(options.password);
      navigate("/");
    } catch (error) {
      setError("Failed to create database");
      console.error("Database creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDatabase = async () => {
    try {
      if (window.electron) {
        const { dialog } = window.electron;
        const { filePaths } = await dialog.showOpenDialog({
          title: 'Open Database',
          filters: [{ name: 'KeePass Database', extensions: ['kdbx'] }]
        });
        
        if (filePaths && filePaths.length > 0) {
          const filePath = filePaths[0];
          const fileName = filePath.split('/').pop()?.replace('.kdbx', '') || '';
          setSelectedDatabase({ name: fileName, path: filePath, password: '' });
          setShowPasswordPrompt(true);
        }
      }
    } catch (error) {
      setError("Failed to open database");
      console.error("Database open error:", error);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDatabase) return;

    setIsLoading(true);
    setError(null);

    try {
      const credentials = await databaseService.createCredentials({ ...selectedDatabase, password });
      await kdbxService.loadDatabase(
        selectedDatabase.name,
        credentials
      );

      setMasterPassword(password);
      navigate("/");
    } catch (error) {
      setError("Invalid password or database error");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showPasswordPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="card max-w-md w-full space-y-8">
          <div className="text-center">
            <FontAwesomeIcon icon={faKey} className="text-4xl text-blue-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-100">
              Open Database
            </h2>
            <p className="mt-2 text-gray-400">
              {selectedDatabase?.name}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faLock} className="mr-2" />
                  Unlock Database
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <FontAwesomeIcon icon={faDatabase} className="text-6xl text-blue-500 mb-6" />
        <h1 className="text-4xl font-bold text-gray-100 mb-2">
          Welcome to Lockbox
        </h1>
        <p className="text-xl text-gray-400">
          Your secure password manager
        </p>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faDatabase} />
          Create New Database
        </button>
        <button
          onClick={handleOpenDatabase}
          className="btn-primary flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faKey} />
          Open Database
        </button>
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">Your Databases</h2>
        <DatabaseManager
          onDatabaseSelect={handleDatabaseSelect}
          onDatabaseCreate={handleDatabaseCreate}
          showCreateForm={showCreateForm}
        />
      </div>
    </div>
  );
};

export default LoginScreen; 