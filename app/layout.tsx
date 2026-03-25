import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AlphaFour — Connect 4 AI Visualizer",
  description: "A Connect 4 game with Minimax AI and real-time Alpha-Beta pruning visualization. Built for FT3 Application Development.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=Inter:wght@100;200;300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-background text-on-surface font-body selection:bg-white selection:text-black overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
