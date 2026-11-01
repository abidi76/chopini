import { AuthProvider } from './components/AuthProvider';
import Header from './components/Header';

export const metadata = { title: 'chopini', description: 'Achetez et vendez neuf et occasion' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '1.5rem' }}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
