'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import { button, errorBox, form, input } from '../styles';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h2>Connexion</h2>
      <form onSubmit={onSubmit} style={form}>
        {error && <div style={errorBox}>{error}</div>}
        <input style={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input style={input} type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button style={button} disabled={busy}>{busy ? 'Connexion...' : 'Se connecter'}</button>
        <p>Pas de compte ? <Link href="/register">Inscris-toi</Link></p>
      </form>
    </main>
  );
}
