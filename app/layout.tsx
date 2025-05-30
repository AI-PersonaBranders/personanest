// app/layout.tsx
export const metadata = {
  title: 'PersonaNest',
  description: 'Create, customize and monetize your AI persona',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
