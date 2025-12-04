import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = storage.get(key);
    return storedValue !== null ? storedValue : initialValue;
  });

  useEffect(() => {
    storage.set(key, value);
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;