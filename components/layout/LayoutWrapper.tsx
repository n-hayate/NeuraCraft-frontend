"use client";

import { usePathname } from "next/navigation";
import { CommonSidebar } from "./CommonSidebar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

/**
 * レイアウトラッパーコンポーネント
 * usePathnameを使用するためClient Componentとして実装
 * ログインページとモバイル専用ページではサイドバーを表示しない
 */
export const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  const pathname = usePathname();

  // ログインページとモバイル専用ページではサイドバーを表示しない
  const showSidebar = pathname !== "/login" && !pathname.startsWith("/mobile/");

  return (
    <div className="flex">
      {/* サイドバー（ログインページとモバイルページ以外） */}
      {showSidebar && <CommonSidebar />}

      {/* メインコンテンツ */}
      <main className={showSidebar ? "ml-[220px] flex-1" : "w-full"}>
        {children}
      </main>
    </div>
  );
};
