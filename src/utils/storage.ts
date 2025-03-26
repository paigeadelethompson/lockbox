import { Entry } from '../types/Entry';

const STORAGE_KEY = 'passwordEntries';

export const getEntries = async (): Promise<Entry[]> => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveEntries = async (entries: Entry[]): Promise<void> => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

export const addEntry = async (entry: Entry): Promise<void> => {
  const entries = await getEntries();
  entries.push(entry);
  await saveEntries(entries);
};

export const updateEntry = async (id: string, updatedEntry: Entry): Promise<void> => {
  const entries = await getEntries();
  const index = entries.findIndex(entry => entry.id === id);
  if (index !== -1) {
    entries[index] = updatedEntry;
    await saveEntries(entries);
  }
};

export const deleteEntry = async (id: string): Promise<void> => {
  const entries = await getEntries();
  const filteredEntries = entries.filter(entry => entry.id !== id);
  await saveEntries(filteredEntries);
}; 