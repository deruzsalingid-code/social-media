import './globals.css';
import Sidebar from '../components/Sidebar';

export const metadata = {
  title: 'smartmomvestor dashboard',
  description: 'Dashboard internal konten dan growth smartmomvestor',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="main-container">{children}</main>
        </div>
      </body>
    </html>
  );
}
