import "./globals.css";

export const metadata = {
  title: "Flower Garden",
  description: "An interactive garden where every click plants a flower",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
