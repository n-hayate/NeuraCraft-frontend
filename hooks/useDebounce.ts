import { useEffect, useState } from 'react';

/**
 * デバウンス処理を行うカスタムフック
 * @param value - デバウンス対象の値
 * @param delay - 遅延時間（ミリ秒）
 * @returns デバウンスされた値
 */
export const useDebounce = <T,>(value: T, delay: number = 300): T => {
  // デバウンスされた値を保持
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 指定時間後に値を更新するタイマーをセット
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ: コンポーネントのアンマウント時や
    // valueが変更された際にタイマーをクリア
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
