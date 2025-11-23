import { forwardRef, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

// InputコンポーネントのPropsの型定義
// InputHTMLAttributes<HTMLInputElement>を継承して、標準のinput属性を全て利用可能に
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;   // ラベルテキスト（オプショナル）
  error?: string;   // エラーメッセージ（オプショナル）
}

// forwardRefを使用してrefを親コンポーネントから受け取れるようにする
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {/* ラベルが指定されている場合のみ表示 */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {/* required属性がtrueの場合、赤いアスタリスクを表示 */}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* 実際の入力フィールド */}
        <input
          ref={ref}  // refを転送
          className={clsx(
            // 基本スタイル
            'w-full px-4 py-3 border border-gray-300 rounded-lg',
            // フォーカス時のスタイル
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            // プレースホルダーのスタイル
            'placeholder:text-gray-400',
            // エラー時は赤い枠線
            error && 'border-red-500',
            // 親から渡されたclassNameを追加
            className
          )}
          {...props}  // その他のpropsを展開
        />

        {/* エラーメッセージがある場合のみ表示 */}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

// React DevToolsでコンポーネント名を表示するための設定
Input.displayName = 'Input';
