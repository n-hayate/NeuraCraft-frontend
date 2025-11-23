import { redirect } from 'next/navigation';

export default function Home() {
  // ルートパスにアクセスされたらログインページにリダイレクト
  redirect('/login');
}
