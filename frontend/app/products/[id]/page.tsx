import { notFound } from 'next/navigation';
import { API, CONDITIONS } from '../../lib/api';

type Product = {
  id: string;
  title: string;
  description: string;
  price: string;
  condition: string;
  brand: string | null;
  size: string | null;
  city: string | null;
  images: { url: string }[];
  category: { name: string };
  seller: { name: string; city: string | null };
};

export default async function ProductPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${API}/products/${params.id}`, { cache: 'no-store' }).catch(() => null);
  if (!res || !res.ok) notFound();
  const p: Product = await res.json();

  return (
    <main style={{ maxWidth: 720 }}>
      {p.images[0] && <img src={p.images[0].url} alt={p.title} style={{ width: '100%', borderRadius: 8 }} />}
      <h2>{p.title}</h2>
      <p style={{ fontSize: '1.4rem', fontWeight: 700 }}>{p.price} TND</p>
      <p>{CONDITIONS[p.condition] ?? p.condition} · {p.category.name}</p>
      <p>{p.description}</p>
      <ul>
        {p.brand && <li>Marque : {p.brand}</li>}
        {p.size && <li>Taille : {p.size}</li>}
        {(p.city ?? p.seller.city) && <li>Ville : {p.city ?? p.seller.city}</li>}
        <li>Vendeur : {p.seller.name}</li>
      </ul>
    </main>
  );
}
