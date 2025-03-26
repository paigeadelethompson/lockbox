const storage = {};

const AsyncStorage = {
  setItem: async (key, value) => {
    storage[key] = value;
    return Promise.resolve();
  },
  getItem: async (key) => {
    return Promise.resolve(storage[key]);
  },
  removeItem: async (key) => {
    delete storage[key];
    return Promise.resolve();
  },
  clear: async () => {
    Object.keys(storage).forEach(key => delete storage[key]);
    return Promise.resolve();
  },
  getAllKeys: async () => {
    return Promise.resolve(Object.keys(storage));
  },
  multiGet: async (keys) => {
    const values = keys.map(key => [key, storage[key]]);
    return Promise.resolve(values);
  },
  multiSet: async (keyValuePairs) => {
    keyValuePairs.forEach(([key, value]) => {
      storage[key] = value;
    });
    return Promise.resolve();
  },
  multiRemove: async (keys) => {
    keys.forEach(key => delete storage[key]);
    return Promise.resolve();
  },
};

export default AsyncStorage; 