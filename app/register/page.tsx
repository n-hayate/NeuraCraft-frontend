'use client';

import { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { SuccessModal } from '@/components/ui/SuccessModal';

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

  // ファイル選択状態（選択済みかどうか）
  const [fileSelected, setFileSelected] = useState(false);

  // ポップアップ表示制御
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // フォーム入力変更時の処理
  const handleInputChange = (field: keyof FileUploadForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  /**
   * ファイル名からメタデータを自動抽出する関数
   * ファイル名の形式: 最終製品_課題感_使用原料_提案企業_試作ID_開発担当者
   * 例: カルボナーラソース_凝固防止、分離防止_エマヒートLV、D-34、シミコマーズ_C社_ID3294_荒木
   */
  const parseFileNameToMetadata = (fileName: string) => {
    // 拡張子を除去
    const nameWithoutExtension = fileName.replace(/\.(pdf|xlsx?|xls|pptx?|ppt|docx?|doc)$/i, '');

    // アンダースコアで分割
    const parts = nameWithoutExtension.split('_');

    // 各パートを対応するフィールドにマッピング
    return {
      finalProduct: parts[0]?.trim() || '',    // 最終製品
      challenge: parts[1]?.trim() || '',       // 課題感
      ingredients: parts[2]?.trim() || '',     // 使用原料
      company: parts[3]?.trim() || '',         // 提案企業
      trialId: parts[4]?.trim() || '',         // 試作ID
      assignee: parts[5]?.trim() || '',        // 開発担当者
    };
  };

  // ファイル選択時の処理
  const handleFileSelect = (file: File) => {
    // 許可するファイル形式のリスト
    const allowedTypes = [
      'application/pdf',                                                      // PDF
      'application/vnd.ms-excel',                                            // Excel（古い形式）
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  // Excel（新しい形式）
      'application/vnd.ms-powerpoint',                                       // PowerPoint（旧形式）
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PowerPoint（新形式）
      'application/msword',                                                  // Word（旧形式）
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',   // Word（新形式）
    ];

    // ファイル形式チェック
    if (!allowedTypes.includes(file.type)) {
      alert('PDF、Excel、PowerPoint、Word ファイルを選択してください');
      return;
    }

    // ファイル名からメタデータを自動抽出
    const metadata = parseFileNameToMetadata(file.name);

    // ファイルとメタデータをフォームデータに設定
    setFormData({
      ...formData,
      file,
      ...metadata,  // メタデータを自動入力
    });

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

  // ポップアップ閉じる処理
  const handleCloseModal = () => {
    setShowSuccessModal(false);

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
    setUploadSuccess(false);

    // ページトップにスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      // ファイルは 'uploaded_file' という名前で送信（Swagger UIで確認した仕様に合わせる）
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

      // デバッグ: FormDataの内容を確認
      console.log('FormData entries:');
      for (const [key, value] of uploadData.entries()) {
        console.log(`- ${key}:`, value instanceof File ? `File(${value.name})` : value);
      }

      // filesApi.create()を使ってアップロード
      const { filesApi } = await import('@/api/files');
      const response = await filesApi.create(uploadData);

      // 成功時の処理: ポップアップ表示
      setUploadedFileName(formData.file.name);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Upload error:', error);
      alert('アップロードに失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Headerは削除。Sidebarはlayoutで追加される */}

      <main className="p-10">
        <div className="max-w-[800px] mx-auto">
          {/* ページタイトル */}
          <h1 className="text-[32px] font-bold text-[#333333] mb-[30px]">
            新規ナレッジ登録
          </h1>

          <form onSubmit={handleSubmit} className="space-y-[30px]">
            {/* ファイルアップロードセクション */}
            <div>
              {/* ドラッグ&ドロップエリア */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  bg-white border-[3px] border-dashed rounded-[10px] p-[60px_0] h-[224px]
                  flex flex-col items-center justify-center transition-all
                  ${isDragging ? 'border-[#588DFF] bg-[#E6F0FF]' : 'border-[#A1A1A1]'}
                `}
              >
                {/* アップロードアイコン */}
                <Upload className="w-[48px] h-[48px] text-[#A5A5A5] mb-4" />

                <p className="text-[16px] text-[#333333] mb-2">
                  ファイルをドラッグ&ドロップ
                </p>
                <p className="text-[14px] text-[#A5A5A5] mb-4">または</p>

                {/* ファイル選択ボタン */}
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".pdf,.xls,.xlsx,.ppt,.pptx,.doc,.docx"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <span className="inline-flex items-center justify-center w-[180px] h-[48px] bg-[#5F6E86] text-white text-[16px] font-bold rounded-lg cursor-pointer hover:bg-[#4A5568] transition-colors">
                    ファイルを選択
                  </span>
                </label>

                <p className="text-[12px] text-[#A5A5A5] mt-4">
                  PDF、Excel、PowerPoint、Word ファイルをアップロードしてください。
                </p>
              </div>

              {/* ファイル選択完了メッセージ */}
              {fileSelected && !uploadSuccess && formData.file && (
                <div className="mt-4 p-4 bg-[#E6F7FF] border border-[#91D5FF] rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-[#1890FF] flex-shrink-0" />
                  <div>
                    <p className="text-[16px] font-bold text-[#0050B3]">
                      ファイルが選択されました
                    </p>
                    <p className="text-[14px] text-[#0050B3] mt-1">
                      ファイル名: {formData.file.name}
                    </p>
                    <p className="text-[14px] text-[#0050B3] mt-1">
                      メタ情報を入力して「登録する」ボタンを押してください。
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* メタ情報入力セクション */}
            <div className="bg-white border border-[#D9D9D9] rounded-[10px] p-[30px]">
              <h2 className="text-[20px] font-bold text-[#333333] mb-6">メタ情報入力</h2>

              {/* 2列グリッドレイアウト */}
              <div className="grid grid-cols-2 gap-x-[40px] gap-y-6">
                {/* 最終製品 */}
                <div>
                  <label className="block text-[16px] font-bold text-[#333333] mb-2">
                    最終製品 <span className="text-[#FF4D4F]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="最終製品名を入力"
                    value={formData.finalProduct}
                    onChange={(e) => handleInputChange('finalProduct', e.target.value)}
                    className="w-full h-[40px] border border-[#A1A1A1] rounded-[10px] px-4 text-[14px] text-[#333333] placeholder:text-[#A5A5A5]"
                    required
                  />
                </div>

                {/* 課題感 */}
                <div>
                  <label className="block text-[16px] font-bold text-[#333333] mb-2">
                    課題感 <span className="text-[#FF4D4F]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="課題を入力"
                    value={formData.challenge}
                    onChange={(e) => handleInputChange('challenge', e.target.value)}
                    className="w-full h-[40px] border border-[#A1A1A1] rounded-[10px] px-4 text-[14px] text-[#333333] placeholder:text-[#A5A5A5]"
                    required
                  />
                </div>

                {/* 使用原料 */}
                <div>
                  <label className="block text-[16px] font-bold text-[#333333] mb-2">
                    使用原料 <span className="text-[#FF4D4F]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="使用した原料を入力"
                    value={formData.ingredients}
                    onChange={(e) => handleInputChange('ingredients', e.target.value)}
                    className="w-full h-[40px] border border-[#A1A1A1] rounded-[10px] px-4 text-[14px] text-[#333333] placeholder:text-[#A5A5A5]"
                    required
                  />
                </div>

                {/* 提案企業（顧客） */}
                <div>
                  <label className="block text-[16px] font-bold text-[#333333] mb-2">
                    提案企業（顧客） <span className="text-[#FF4D4F]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="顧客名を入力"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full h-[40px] border border-[#A1A1A1] rounded-[10px] px-4 text-[14px] text-[#333333] placeholder:text-[#A5A5A5]"
                    required
                  />
                </div>

                {/* 試作ID */}
                <div>
                  <label className="block text-[16px] font-bold text-[#333333] mb-2">
                    試作ID <span className="text-[#FF4D4F]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="IDを入力"
                    value={formData.trialId}
                    onChange={(e) => handleInputChange('trialId', e.target.value)}
                    className="w-full h-[40px] border border-[#A1A1A1] rounded-[10px] px-4 text-[14px] text-[#333333] placeholder:text-[#A5A5A5]"
                    required
                  />
                </div>

                {/* 開発担当者 */}
                <div>
                  <label className="block text-[16px] font-bold text-[#333333] mb-2">
                    開発担当者
                  </label>
                  <input
                    type="text"
                    placeholder="担当者名を入力"
                    value={formData.assignee}
                    onChange={(e) => handleInputChange('assignee', e.target.value)}
                    className="w-full h-[40px] border border-[#A1A1A1] rounded-[10px] px-4 text-[14px] text-[#333333] placeholder:text-[#A5A5A5]"
                  />
                </div>
              </div>
            </div>

            {/* 登録ボタン */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading || !formData.file}
                className={`
                  w-[267px] h-[56px] text-[20px] font-bold rounded-[10px]
                  transition-colors
                  ${isLoading || !formData.file
                    ? 'bg-[#EFEFEF] text-[#A5A5A5] cursor-not-allowed'
                    : 'bg-[#FFCB06] text-white hover:bg-[#E6B800]'
                  }
                `}
              >
                {isLoading ? '登録中...' : '登録する'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* 登録完了ポップアップ */}
      <SuccessModal
        isOpen={showSuccessModal}
        fileName={uploadedFileName}
        onClose={handleCloseModal}
      />
    </div>
  );
}
