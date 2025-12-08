'use client';

import { CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  fileName: string;
  onClose: () => void;
}

/**
 * 登録完了時に表示するモーダルコンポーネント
 * 設計書: doc\テキスト\20251208_ナレッジ登録ページ詳細設計書.md
 *
 * 仕様:
 * - 画面中央にポップアップ表示
 * - 3秒後に自動で閉じる
 * - OKボタンクリックで即座に閉じる
 */
export const SuccessModal = ({ isOpen, fileName, onClose }: SuccessModalProps) => {
  // 3秒後に自動で閉じる
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // オーバーレイ
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* ポップアップカード */}
      <div className="bg-white rounded-[10px] p-10 shadow-[0px_8px_24px_rgba(0,0,0,0.15)] w-[500px] text-center">
        {/* 成功アイコン */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-[60px] h-[60px] text-[#52C41A]" />
        </div>

        {/* タイトル */}
        <h2 className="text-[24px] font-bold text-[#333333] mb-4">
          ナレッジの登録が完了しました！
        </h2>

        {/* メッセージ */}
        <p className="text-[16px] text-[#666666] mb-8">
          登録ファイル名: {fileName}
        </p>

        {/* OKボタン */}
        <button
          onClick={onClose}
          className="w-[120px] h-[48px] bg-[#5F6E86] text-white text-[16px] font-bold rounded-lg hover:bg-[#4A5568] transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};
