import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "JS/React/Next Q&A Chat",
  description: "Ask questions about JavaScript, React, and Next.js; answers stored in MongoDB.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black antialiased">
        <div className="mx-auto max-w-3xl p-4">
          <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/50 bg-white/70 border-b">
            <div className="flex items-center justify-between py-3">
              <h1 className="text-2xl font-bold">JS/React/Next Q&A Chat</h1>
              <nav className="flex gap-3 text-sm">
                <a className="hover:underline" href="/">Chat</a>
                <a className="hover:underline" href="/history">History</a>
                <a className="hover:underline" href="https://nextjs.org/docs" target="_blank">Docs</a>
              </nav>
            </div>
          </header>
          <main className="py-6">{children}</main>
          <footer className="py-10 text-center text-xs text-neutral-500">
            Built with Next.js, MongoDB
            {process.env.OPENAI_API_KEY ? " & OpenAI" : ""}
          </footer>
        </div>
      </body>
    </html>
  );
}
