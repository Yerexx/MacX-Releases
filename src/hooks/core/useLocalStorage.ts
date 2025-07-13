import { useCallback, useState } from "react";

type SetValue<T> = T | ((prevValue: T) => T);

/**
 * Custom hook for managing state in localStorage
 * @param key The key to store the value under in localStorage
 * @param initialValue The initial value to use if no value exists in localStorage
 * @returns [storedValue, setValue] tuple similar to useState
 */
export const useLocalStorage = <T>(key: string, initialValue: T) => {
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === "undefined") {
			return initialValue;
		}

		try {
			const item = window.localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : initialValue;
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	});

	const setValue = useCallback(
		(value: SetValue<T>) => {
			try {
				const valueToStore =
					value instanceof Function ? value(storedValue) : value;

				setStoredValue(valueToStore);

				if (typeof window !== "undefined") {
					window.localStorage.setItem(key, JSON.stringify(valueToStore));
				}
			} catch (error) {
				console.warn(`Error setting localStorage key "${key}":`, error);
			}
		},
		[key, storedValue],
	);

	return [storedValue, setValue] as const;
};
