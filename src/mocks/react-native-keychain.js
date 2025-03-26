// Mock implementation of react-native-keychain for web
const storage = {};

export const setGenericPassword = async (username, password) => {
  storage[username] = password;
  return true;
};

export const getGenericPassword = async () => {
  const username = 'master';
  const password = storage[username];
  if (!password) {
    return false;
  }
  return { username, password };
};

export const resetGenericPassword = async () => {
  storage.master = null;
  return true;
}; 