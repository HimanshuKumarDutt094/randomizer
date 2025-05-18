export default function ApiDocLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <section className="container">
          <h1 className="text-2xl font-bold">API Documentation</h1>
          {children}
        </section>
      </body>
    </html>
  );
}
