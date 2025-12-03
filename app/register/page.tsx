'use client';

import { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Input } from '@/components/ui/Input';

// フォームデータの型定義
interface FileUploadForm {
  finalProduct: string;   // 最終製品
  challenge: string;      // 課題感
  ingredients: string;    // 使用原料
  company: string;        // 提案企業（顧客）
  trialId: string;        // 試作ID
  assignee: string;       // 開発担当者
  file: File | null;      // アップロードするファイル
}

export default function FileRegisterPage() {
  // フォームデータの状態管理
  const [formData, setFormData] = useState<FileUploadForm>({
    finalProduct: '',
    challenge: '',
    ingredients: '',
    company: '',
    trialId: '',
    assignee: '',
    file: null,
  });

  // アップロード成功フラグ
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // アップロード後のファイル名
  const [uploadedFileName, setUploadedFileName] = useState('');

  // ローディング状態
  const [isLoading, setIsLoading] = useState(false);

  // ドラッグ中フラグ（視覚的フィードバック用）
  const [isDragging, setIsDragging] = useState(false);

  // フォーム入力変更時の処理
  const handleInputChange = (field: keyof FileUploadForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // ファイル選択状態（選択済みかどうか）
  const [fileSelected, setFileSelected] = useState(false);

  // ファイル選択時の処理
  const handleFileSelect = (file: File) => {
    // 許可するファイル形式のリスト
    const allowedTypes = [
      'application/pdf',                                                      // PDF
      'application/vnd.ms-excel',                                            // Excel（古い形式）
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  // Excel（新しい形式）
    ];

    // ファイル形式チェック
    if (!allowedTypes.includes(file.type)) {
      alert('Excel または PDF ファイルを選択してください');
      return;
    }

    // ファイルをフォームデータに追加
    setFormData({ ...formData, file });

    // ファイル選択完了フラグを立てる
    setFileSelected(true);

    // 登録成功フラグはリセット（新しいファイル選択時）
    setUploadSuccess(false);
  };

  // ファイルドロップ時の処理
  const handleDrop = (e: React.DragEvent) => {
    // ブラウザのデフォルト動作（ファイルを開く）を防止
    e.preventDefault();
    setIsDragging(false);

    // ドロップされたファイルを取得
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  // ドラッグオーバー時の処理
  const handleDragOver = (e: React.DragEvent) => {
    // ブラウザのデフォルト動作を防止
    e.preventDefault();
    setIsDragging(true);  // ドラッグ中のスタイルを適用
  };

  // ドラッグが離れた時の処理
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // input要素からファイルが選択された時の処理
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  // フォーム送信時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    // デフォルトのフォーム送信を防止
    e.preventDefault();

    // バリデーション: 必須項目のチェック
    if (!formData.finalProduct || !formData.challenge || !formData.ingredients ||
        !formData.company || !formData.trialId || !formData.file) {
      alert('必須項目を全て入力してください');
      return;
    }

    setIsLoading(true);

    try {
      // FormDataを作成してファイルとメタデータを設定
      const uploadData = new FormData();

      // ファイルは 'uploaded_file' という名前で送信（バックエンドの実装に合わせる）
      uploadData.append('uploaded_file', formData.file);

      // メタデータフィールドを追加
      uploadData.append('application', formData.finalProduct);
      uploadData.append('issue', formData.challenge);
      uploadData.append('ingredient', formData.ingredients);
      uploadData.append('customer', formData.company);
      uploadData.append('trial_id', formData.trialId);

      // 開発担当者が入力されている場合のみ追加
      if (formData.assignee) {
        uploadData.append('author', formData.assignee);
      }

      // filesApi.create()を使ってアップロード
      const { filesApi } = await import('@/api/files');
      const response = await filesApi.create(uploadData);

      // 成功時の処理
      setUploadedFileName((response as any).filename || 'ファイル名取得失敗');
      setUploadSuccess(true);

      // フォームリセット
      setFormData({
        finalProduct: '',
        challenge: '',
        ingredients: '',
        company: '',
        trialId: '',
        assignee: '',
        file: null,
      });
      setFileSelected(false);
    } catch (error) {
      console.error('Upload error:', error);
      alert('アップロードに失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          新規ナレッジ登録
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* メタ情報入力セクション */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">メタ情報入力</h2>

            {/* 2列グリッドレイアウト */}
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="最終製品"
                placeholder="最終製品名を入力"
                value={formData.finalProduct}
                onChange={(e) => handleInputChange('finalProduct', e.target.value)}
                required
              />

              <Input
                label="課題感"
                placeholder="課題を入力"
                value={formData.challenge}
                onChange={(e) => handleInputChange('challenge', e.target.value)}
                required
              />

              <Input
                label="使用原料"
                placeholder="使用した原料を入力"
                value={formData.ingredients}
                onChange={(e) => handleInputChange('ingredients', e.target.value)}
                required
              />

              <Input
                label="提案企業（顧客）"
                placeholder="顧客名を入力"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                required
              />

              <Input
                label="試作ID"
                placeholder="IDを入力"
                value={formData.trialId}
                onChange={(e) => handleInputChange('trialId', e.target.value)}
                required
              />

              <Input
                label="開発担当者"
                placeholder="担当者名を入力"
                value={formData.assignee}
                onChange={(e) => handleInputChange('assignee', e.target.value)}
              />
            </div>
          </div>

          {/* ファイルアップロードセクション */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">ファイルアップロード</h2>

            {/* ドラッグ&ドロップエリア */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center
                transition-colors
                ${isDragging ? 'border-primary bg-secondary/20' : 'border-gray-300'}
              `}
            >
              {/* アップロードアイコン */}
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />

              <p className="text-gray-600 mb-2">
                ファイルをドラッグ&ドロップ
              </p>
              <p className="text-gray-500 text-sm mb-4">または</p>

              {/* ファイル選択ボタン */}
              <label className="inline-block">
                <input
                  type="file"
                  accept=".pdf,.xls,.xlsx"
                  onChange={handleFileInput}
                  className="hidden"  // input要素を非表示にしてlabelをボタンとして使用
                />
                <span className="px-6 py-3 bg-secondary text-primary rounded-lg cursor-pointer hover:bg-secondary/80 inline-block">
                  ファイルを選択
                </span>
              </label>

              <p className="text-sm text-gray-500 mt-4">
                Excel または PDF ファイルをアップロードしてください。
              </p>
            </div>

            {/* ファイル選択完了メッセージ */}
            {fileSelected && !uploadSuccess && formData.file && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-blue-800 font-medium">
                    ファイルが選択されました
                  </p>
                  <p className="text-blue-700 text-sm">
                    ファイル名: {formData.file.name}
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    メタ情報を入力して「登録する」ボタンを押してください。
                  </p>
                </div>
              </div>
            )}
            

            {/* アップロード成功メッセージ */}
            {uploadSuccess && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-green-800 font-medium">
                    ナレッジの登録が完了しました！
                  </p>
                  <p className="text-green-700 text-sm">
                    登録ファイル名: {uploadedFileName}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 登録ボタン */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-16 py-4 text-lg font-bold shadow-lg hover:shadow-xl bg-gray-200 text-black hover:bg-gray-300 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登録中...' : '登録する'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
