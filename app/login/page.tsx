'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { AuthHeader } from '@/components/layout/AuthHeader';

export default function LoginPage() {
  // useRouter: プログラムでページ遷移を行うためのフック（Next.js App Router）
  const router = useRouter();

  // Zustandストアからlogin関数を取得
  const login = useAuthStore((state) => state.login);

  // フォームのデータを管理するstate
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // パスワードの表示/非表示を管理するstate
  const [showPassword, setShowPassword] = useState(false);

  // バリデーションエラーを管理するstate
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // ローディング状態を管理するstate
  const [isLoading, setIsLoading] = useState(false);

  // フォーム送信時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    // デフォルトのフォーム送信（ページリロード）を防止
    e.preventDefault();

    // エラーをクリア
    setErrors({});

    // バリデーション処理
    const newErrors: { email?: string; password?: string } = {};

    // メールアドレスのバリデーション
    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      // 正規表現でメールアドレスの形式をチェック
      newErrors.email = '正しいメールアドレスを入力してください';
    }

    // パスワードのバリデーション
    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 6) {
      newErrors.password = 'パスワードは6文字以上で入力してください';
    }

    // エラーがある場合は処理を中断
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ログイン処理
    try {
      setIsLoading(true);  // ローディング開始

      // ストアのlogin関数を実行（非同期処理）
      await login(formData.email, formData.password);

      // ログイン成功後、検索画面へ遷移
      router.push('/search');
    } catch (error: any) {
      // ログイン失敗時のエラーメッセージを設定
      console.error('Login error:', error);

      // エラーメッセージを適切に設定
      const errorMessage = error?.response?.status === 401
        ? 'メールアドレスまたはパスワードが正しくありません'
        : error?.message || 'ログインに失敗しました。もう一度お試しください。';

      setErrors({ password: errorMessage });
    } finally {
      // 成功・失敗に関わらずローディングを終了
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
      {/* ヘッダー */}
      <AuthHeader />

      {/* メインコンテンツ */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[506px]">

        {/* ログインフォーム */}
        <div className="bg-white rounded-[10px] shadow-[0px_2px_8px_rgba(0,0,0,0.08)] p-10 border border-[#D9D9D9] w-full">
          <h2 className="text-[24px] font-bold text-[#333333] mb-[30px]">ログイン</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* メールアドレス入力 */}
            <div>
              <label className="block text-[16px] font-normal text-[#333333] mb-2">
                アカウントIDまたはメールアドレス
              </label>
              <input
                type="email"
                placeholder="IDまたはメールアドレスを入力"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-[56px] bg-white border border-[#D9D9D9] rounded-[10px] px-4 text-[16px] placeholder:text-[#A5A5A5] focus:outline-none focus:ring-2 focus:ring-[#5F6E86] focus:border-transparent"
                required
              />
              {errors.email && (
                <p className="text-[14px] text-[#FF4D4F] mt-2">※{errors.email}</p>
              )}
            </div>

            {/* パスワード入力（表示/非表示切替ボタン付き） */}
            <div>
              <label className="block text-[16px] font-normal text-[#333333] mb-2">
                パスワード
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="パスワードを入力"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-[56px] bg-white border border-[#D9D9D9] rounded-[10px] px-4 pr-12 text-[16px] placeholder:text-[#A5A5A5] focus:outline-none focus:ring-2 focus:ring-[#5F6E86] focus:border-transparent"
                  required
                />
                {/* パスワード表示切替ボタン */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[14px] text-[#FF4D4F] mt-2">※{errors.password}</p>
              )}
            </div>

            {/* ログインボタン */}
            <div className="pt-[10px]">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[56px] bg-[#5F6E86] text-white text-[20px] font-bold rounded-[10px] hover:bg-[#4A5568] disabled:bg-[#A5A5A5] disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>
          </form>

          {/* パスワード忘れリンク */}
          <div className="mt-5 text-center">
            <a
              href="#"
              className="text-[16px] text-[#2E938C] hover:underline"
            >
              パスワードを忘れた場合
            </a>
          </div>
        </div>

          {/* コピーライト */}
          <p className="text-center text-[12px] text-[#A5A5A5] mt-[30px]">
            © Example Company 2024
          </p>
        </div>
      </div>
    </div>
  );
}
