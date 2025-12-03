'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, FlaskConical } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* ロゴとタイトル */}
        <div className="text-center mb-8">
          {/* フラスコアイコンを円形の背景に配置 */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary rounded-full mb-4">
            <FlaskConical className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            食品開発ナレッジベース
          </h1>
        </div>

        {/* ログインフォーム */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-xl font-bold text-center mb-6">ログイン</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* メールアドレス入力 */}
            <Input
              label="アカウントIDまたはメールアドレス"
              type="email"
              placeholder="IDまたはメールアドレスを入力"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
              required
            />

            {/* パスワード入力（表示/非表示切替ボタン付き） */}
            <div className="relative">
              <Input
                label="パスワード"
                type={showPassword ? 'text' : 'password'}  // 条件によってtypeを切り替え
                placeholder="パスワードを入力"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                required
              />
              {/* パスワード表示切替ボタン */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />  // パスワード非表示アイコン
                ) : (
                  <Eye className="w-5 h-5" />     // パスワード表示アイコン
                )}
              </button>
            </div>

            {/* ログインボタン */}
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              ログイン
            </Button>
          </form>

          {/* パスワード忘れリンク */}
          <div className="mt-4 text-center">
            <a
              href="#"
              className="text-sm text-primary hover:underline"
            >
              パスワードをお忘れの場合
            </a>
          </div>
        </div>

        {/* コピーライト */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © Example Company 2024
        </p>
      </div>
    </div>
  );
}
