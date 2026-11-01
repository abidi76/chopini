export const metadata = { title: 'chopini', description: 'Achetez et vendez neuf et occasion' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '1.5rem' }}>
        <header style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ margin: 0 }}>chopini</h1>
        </header>
        {children}
      </body>
    </html>
  );
}
