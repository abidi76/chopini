'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';
import { api, CONDITIONS } from '../lib/api';
import { button, errorBox, form, input } from '../styles';

type Category = { id: string; name: string; children: Category[] };

export default function SellPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([]);
  const [f, setF] = useState({
    title: '', description: '', price: '', condition: 'GOOD', categoryId: '',
    brand: '', size: '', city: '', imageUrl: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    api<Category[]>('/categories')
      .then((list) =>
        setCategories(list.flatMap((c) => c.children.map((ch) => ({ id: ch.id, label: `${c.name} › ${ch.name}` })))),
      )
      .catch(() => setError('Impossible de charger les catégories'));
  }, []);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF({ ...f, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const p = await api<{ id: string }>('/products', {
        method: 'POST',
        body: JSON.stringify({
          title: f.title,
          description: f.description,
          price: Number(f.price),
          condition: f.condition,
          categoryId: f.categoryId,
          brand: f.brand || undefined,
          size: f.size || undefined,
          city: f.city || undefined,
          imageUrls: f.imageUrl ? [f.imageUrl] : undefined,
        }),
      });
      router.push(`/products/${p.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (loading || !user) return <p>Chargement...</p>;

  return (
    <main>
      <h2>Publier une annonce</h2>
      <form onSubmit={onSubmit} style={form}>
        {error && <div style={errorBox}>{error}</div>}
        <input style={input} placeholder="Titre" value={f.title} onChange={set('title')} required />
        <textarea style={{ ...input, minHeight: 100 }} placeholder="Description (10 caractères minimum)" value={f.description} onChange={set('description')} required />
        <input style={input} type="number" min="0" step="0.01" placeholder="Prix (TND)" value={f.price} onChange={set('price')} required />
        <select style={input} value={f.condition} onChange={set('condition')}>
          {Object.entries(CONDITIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select style={input} value={f.categoryId} onChange={set('categoryId')} required>
          <option value="">Choisir une catégorie</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <input style={input} placeholder="Marque (optionnel)" value={f.brand} onChange={set('brand')} />
        <input style={input} placeholder="Taille (optionnel)" value={f.size} onChange={set('size')} />
        <input style={input} placeholder="Ville (optionnel)" value={f.city} onChange={set('city')} />
        <input style={input} placeholder="Lien d'une photo (temporaire, avant l'upload)" value={f.imageUrl} onChange={set('imageUrl')} />
        <button style={button} disabled={busy}>{busy ? 'Publication...' : 'Publier'}</button>
      </form>
    </main>
  );
}
