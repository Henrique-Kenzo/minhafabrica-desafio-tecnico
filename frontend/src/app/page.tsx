import { redirect } from 'next/navigation';

export default function Home() {
  // joga pra pagina de login por padrao
  redirect('/login');
}
