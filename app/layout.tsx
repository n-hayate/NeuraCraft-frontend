import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '食品開発ナレッジベース - NeuraCraft',
  description: '食品開発の知見を蓄積・検索するナレッジ管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
