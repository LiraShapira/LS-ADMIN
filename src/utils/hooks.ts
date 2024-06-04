import { useEffect, useState } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export const useMultiAppSelectors: Array<TypedUseSelectorHook<RootState>> = (selectors = []) => {
//   return selectors.map((selector) => useAppSelector(selector))
// };

export function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // when value or delay changes,
  // value is set after {delay}ms
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If the value changes again before the previous setDebouncedValue triggers,
    // the previous setDebouncedValue call is cancelled here
    return () => {
      clearTimeout(timeoutID);
    };
  }, [value, delay]);

  return debouncedValue;
}
