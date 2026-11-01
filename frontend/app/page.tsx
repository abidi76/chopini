type Product = {
  id: string;
  title: string;
  price: string;
  condition: string;
  images: { url: string }[];
};

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API}/products`, { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  return (
    <main>
      <h2>Annonces récentes</h2>
      {products.length === 0 && <p>Aucune annonce pour le moment.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {products.map((p) => (
          <article key={p.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '0.75rem' }}>
            {p.images[0] && <img src={p.images[0].url} alt={p.title} style={{ width: '100%', borderRadius: 6 }} />}
            <h3 style={{ margin: '0.5rem 0 0.25rem' }}>{p.title}</h3>
            <p style={{ margin: 0 }}>{p.price} TND · {p.condition}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
