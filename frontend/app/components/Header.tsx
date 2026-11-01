'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { button } from '../styles';

export default function Header() {
  const { user, loading, logout } = useAuth();
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
      <Link href="/" style={{ fontSize: '1.6rem', fontWeight: 700, textDecoration: 'none', color: 'inherit' }}>
        chopini
      </Link>
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {!loading && user && (
          <>
            <span>Bonjour {user.name}</span>
            <Link href="/sell" style={{ ...button, textDecoration: 'none' }}>Vendre</Link>
            <button onClick={logout} style={{ ...button, background: '#666' }}>Déconnexion</button>
          </>
        )}
        {!loading && !user && (
          <>
            <Link href="/login">Connexion</Link>
            <Link href="/register" style={{ ...button, textDecoration: 'none' }}>Inscription</Link>
          </>
        )}
      </nav>
    </header>
  );
}
