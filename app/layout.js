import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased bg-smart-dark">
        {children}
      </body>
    </html>
  );
}