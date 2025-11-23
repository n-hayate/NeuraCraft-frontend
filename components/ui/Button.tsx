import { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

// ButtonコンポーネントのPropsの型定義
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;                          // ボタンのラベル（テキストや要素）
  variant?: 'primary' | 'secondary' | 'outline';  // ボタンのスタイルバリエーション
  fullWidth?: boolean;                          // 幅100%にするかどうか
  isLoading?: boolean;                          // ローディング状態
}

export const Button = ({
  children,
  variant = 'primary',   // デフォルトはprimaryスタイル
  fullWidth = false,
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  // 全バリアントに共通の基本スタイル
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-colors duration-200';

  // バリアントごとのスタイル定義
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 disabled:bg-gray-300',
    secondary: 'bg-secondary text-primary hover:bg-secondary/80',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
  };

  return (
    <button
      className={clsx(
        baseStyles,                 // 基本スタイル
        variants[variant],          // 選択されたバリアントのスタイル
        fullWidth && 'w-full',      // fullWidthがtrueなら幅100%
        className                   // 親から渡された追加のクラス名
      )}
      // isLoadingまたはdisabledがtrueの場合、ボタンを無効化
      disabled={disabled || isLoading}
      {...props}
    >
      {/* ローディング中は"Loading..."、それ以外はchildrenを表示 */}
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
