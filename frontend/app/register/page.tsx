'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import { button, errorBox, form, input } from '../styles';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ name: '', email: '', password: '', phone: '', city: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register({
        name: f.name,
        email: f.email,
        password: f.password,
        phone: f.phone || undefined,
        city: f.city || undefined,
      });
      router.push('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h2>Inscription</h2>
      <form onSubmit={onSubmit} style={form}>
        {error && <div style={errorBox}>{error}</div>}
        <input style={input} placeholder="Nom" value={f.name} onChange={set('name')} required />
        <input style={input} type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
        <input style={input} type="password" placeholder="Mot de passe (8 caractères minimum)" value={f.password} onChange={set('password')} minLength={8} required />
        <input style={input} placeholder="Téléphone (optionnel)" value={f.phone} onChange={set('phone')} />
        <input style={input} placeholder="Ville (optionnel)" value={f.city} onChange={set('city')} />
        <button style={button} disabled={busy}>{busy ? 'Création...' : 'Créer mon compte'}</button>
        <p>Déjà inscrit ? <Link href="/login">Connecte-toi</Link></p>
      </form>
    </main>
  );
}
