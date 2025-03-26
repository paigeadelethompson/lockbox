import React, { useState, useEffect } from "react";
import { PasswordEntry } from "../types/password";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faPlus, faTrash, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { IconPicker } from "./IconPicker";

interface PasswordEntryFormProps {
  entry?: PasswordEntry;
  onSubmit: (entry: Omit<PasswordEntry, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export const PasswordEntryForm: React.FC<PasswordEntryFormProps> = ({
  entry,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(entry?.title || "");
  const [username, setUsername] = useState(entry?.username || "");
  const [password, setPassword] = useState(entry?.password || "");
  const [url, setUrl] = useState(entry?.url || "");
  const [notes, setNotes] = useState(entry?.notes || "");
  const [icon, setIcon] = useState(entry?.icon || "key");
  const [showPassword, setShowPassword] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      username,
      password,
      url,
      notes,
      icon,
      attachments: [],
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <IconPicker
            value={icon}
            onChange={setIcon}
            className="text-2xl text-blue-500"
          />
        </div>
        <div className="flex-grow">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field w-full"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field w-full pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-field w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input-field w-full h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Attachments
        </label>
        <div className="flex items-center gap-2">
          <label className="btn-secondary cursor-pointer">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Files
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {attachments.length > 0 && (
            <span className="text-sm text-slate-400">
              {attachments.length} file(s) selected
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faTimes} />
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faSave} />
          Save
        </button>
      </div>
    </form>
  );
}; 