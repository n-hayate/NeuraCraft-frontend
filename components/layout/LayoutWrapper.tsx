'use client';

import { usePathname } from 'next/navigation';
import { CommonSidebar } from './CommonSidebar';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

/**
 * レイアウトラッパーコンポーネント
 * usePathnameを使用するためClient Componentとして実装
 * ログインページ以外ではサイドバーを表示
 */
export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const pathname = usePathname();

  // ログインページではサイドバーを表示しない
  const showSidebar = pathname !== '/login';

  return (
    <div className="flex">
      {/* サイドバー（ログインページ以外） */}
      {showSidebar && <CommonSidebar />}

      {/* メインコンテンツ */}
      <main className={showSidebar ? 'ml-[220px] flex-1' : 'w-full'}>
        {children}
      </main>
    </div>
  );
};
