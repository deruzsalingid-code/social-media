import './globals.css';
import Nav from '../components/Nav';

export const metadata = {
  title: 'smartmomvestor dashboard',
  description: 'Dashboard internal konten dan growth smartmomvestor',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Nav />
        <main className="main-container">{children}</main>
      </body>
    </html>
  );
}
