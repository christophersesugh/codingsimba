import { useState, useEffect, useRef } from "react";

type UseLocalStorageStateOptions<T> = {
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
};

function useLocalStorageState<T>(
  key: string,
  defaultValue: T | (() => T) = {} as T,
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: UseLocalStorageStateOptions<T> = {},
) {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const valueInLocalStorage = window.localStorage.getItem(key);
      if (valueInLocalStorage) {
        return deserialize(valueInLocalStorage);
      }
    }
    return typeof defaultValue === "function"
      ? (defaultValue as () => T)()
      : defaultValue;
  });

  const prevKeyRef = useRef<string>(key);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }
    prevKeyRef.current = key;
    window.localStorage.setItem(key, serialize(state));
  }, [key, serialize, state]);

  return [state, setState] as const;
}

export { useLocalStorageState };
