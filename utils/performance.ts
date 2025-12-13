/**
 * パフォーマンスデータ管理とパーセンタイル計算のユーティリティ
 */

export interface PerformanceData {
  e2eTimeMs: number; // E2E時間（ミリ秒）
  searchTimeMs: number | null; // Azure Search処理時間（ミリ秒）
  serverTimeMs: number | null; // Backend処理時間（ミリ秒）
  timestamp: number; // 記録時刻（Unix timestamp）
}

interface PercentileStats {
  p50: number;
  p95: number;
}

class PerformanceCollector {
  private data: PerformanceData[] = [];
  private readonly maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  /**
   * パフォーマンスデータを追加
   */
  add(data: PerformanceData): void {
    this.data.push(data);
    
    // 最大サイズを超えた場合、古いデータを削除
    if (this.data.length > this.maxSize) {
      this.data.shift();
    }
  }

  /**
   * パーセンタイルを計算
   * @param values 数値配列
   * @returns p50とp95の値
   */
  private calculatePercentiles(values: number[]): PercentileStats {
    if (values.length === 0) {
      return { p50: 0, p95: 0 };
    }

    // ソート
    const sorted = [...values].sort((a, b) => a - b);

    // p50（中央値）
    const p50Index = Math.floor(sorted.length * 0.5);
    const p50 = sorted[p50Index] || 0;

    // p95
    const p95Index = Math.floor(sorted.length * 0.95);
    const p95 = sorted[p95Index] || 0;

    return { p50, p95 };
  }

  /**
   * E2E時間のパーセンタイルを計算
   */
  getE2EPercentiles(): PercentileStats {
    const values = this.data.map((d) => d.e2eTimeMs);
    return this.calculatePercentiles(values);
  }

  /**
   * Azure Search処理時間のパーセンタイルを計算（nullを除外）
   */
  getSearchPercentiles(): PercentileStats | null {
    const values = this.data
      .map((d) => d.searchTimeMs)
      .filter((v): v is number => v !== null);
    
    if (values.length === 0) {
      return null;
    }

    return this.calculatePercentiles(values);
  }

  /**
   * Backend処理時間のパーセンタイルを計算（nullを除外）
   */
  getServerPercentiles(): PercentileStats | null {
    const values = this.data
      .map((d) => d.serverTimeMs)
      .filter((v): v is number => v !== null);
    
    if (values.length === 0) {
      return null;
    }

    return this.calculatePercentiles(values);
  }

  /**
   * 全データを取得
   */
  getAllData(): PerformanceData[] {
    return [...this.data];
  }

  /**
   * データをクリア
   */
  clear(): void {
    this.data = [];
  }

  /**
   * データ件数を取得
   */
  getCount(): number {
    return this.data.length;
  }
}

// シングルトンインスタンス
export const performanceCollector = new PerformanceCollector(100);

/**
 * パフォーマンス統計をフォーマットして文字列に変換
 */
export function formatPerformanceStats(): string {
  const e2eStats = performanceCollector.getE2EPercentiles();
  const searchStats = performanceCollector.getSearchPercentiles();
  const serverStats = performanceCollector.getServerPercentiles();

  const lines: string[] = ['検索パフォーマンス:'];
  
  lines.push(`- E2E: p50=${e2eStats.p50}ms, p95=${e2eStats.p95}ms`);
  
  if (searchStats) {
    lines.push(`- Azure Search: p50=${searchStats.p50}ms, p95=${searchStats.p95}ms`);
  } else {
    lines.push('- Azure Search: データなし');
  }
  
  if (serverStats) {
    lines.push(`- Backend: p50=${serverStats.p50}ms, p95=${serverStats.p95}ms`);
  } else {
    lines.push('- Backend: データなし');
  }

  return lines.join('\n');
}


