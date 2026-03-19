import './globals.css';

export const metadata = {
  title: 'Animal Farm — Що є правда?',
  description: 'Інтерактивний темний вебдосвід за мотивами "Колгоспу тварин" про пропаганду, страх і переписування реальності.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
