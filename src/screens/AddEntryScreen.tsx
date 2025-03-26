import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Entry } from "../types/Entry";
import { kdbxService } from "../services/kdbxService";
import { QRScanner } from "../components/QRScanner";
import { TotpService } from "../services/totpService";

const AddEntryScreen: React.FC = () => {
  const navigate = useNavigate();
  const { masterPassword } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [totpData, setTotpData] = useState<Entry['totp']>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newEntry: Entry = {
        id: crypto.randomUUID(),
        ...formData,
        totp: totpData,
        createdAt: Date.now(),
      };

      await kdbxService.addEntry(newEntry);
      navigate("/");
    } catch (error) {
      console.error("Error adding entry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQRScan = (entry: Partial<Entry>) => {
    setTotpData(entry.totp);
    if (entry.title) {
      setFormData(prev => ({ ...prev, title: entry.title! }));
    }
    setShowQRScanner(false);
  };

  const handleQRScanError = (error: Error) => {
    console.error("QR scan error:", error);
    // You might want to show an error message to the user here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Password Entry</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            URL (optional)
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Two-Factor Authentication</h2>
            <button
              type="button"
              onClick={() => setShowQRScanner(!showQRScanner)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {showQRScanner ? "Cancel" : "Scan QR Code"}
            </button>
          </div>

          {showQRScanner && (
            <QRScanner
              onScan={handleQRScan}
              onError={handleQRScanError}
            />
          )}

          {totpData && (
            <div className="p-4 bg-green-50 rounded-md">
              <p className="text-green-700">TOTP configured successfully</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEntryScreen; 