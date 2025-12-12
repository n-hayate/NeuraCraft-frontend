"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";

/**
 * モバイル専用のシンプルなヘッダーコンポーネント
 * 検索に特化したアプリのため、最小限の機能のみ提供
 */
export const MobileHeader = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between h-14 px-4">
        {/* 左側: ロゴとタイトル */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <Image
              src="/logo/app_logo.png"
              alt="アプリロゴ"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <span className="text-base font-bold text-gray-900">
            モバイル検索
          </span>
        </div>

        {/* 右側: ユーザー情報とログアウト */}
        <div className="flex items-center gap-2">
          {/* ユーザーアイコン */}
          <div className="w-7 h-7 bg-orange-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-orange-600" />
          </div>
          {/* ログアウトボタン */}
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
            title="ログアウト"
            aria-label="ログアウト"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

