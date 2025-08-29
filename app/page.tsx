"use client";

import { useState } from "react";

export default function Page() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  const ask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    const q = question.trim();
    setMessages((m) => [...m, { role: "user", content: q }]);
    setQuestion("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
    } catch (err: any) {
      console.error("API Error:", err);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Error: ${
            err.message ||
            "Something went wrong. Please check if OpenAI API key is configured."
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      <form onSubmit={ask} className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about JavaScript, React, or Next.js..."
          className="flex-1 rounded-2xl border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl border px-4 py-3 shadow hover:shadow-md active:shadow-sm disabled:opacity-50"
        >
          {loading ? "Thinking…" : "Ask"}
        </button>
      </form>

      <div className="rounded-2xl border p-4 grid gap-4">
        {messages.length === 0 && (
          <div className="text-sm text-neutral-600">
            💡 Tip: Try “What is prop drilling?”, “How do getServerSideProps and
            server actions differ?”, or “How to optimize React re-rendering?”
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <div
              className={`inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 ${
                m.role === "user" ? "bg-black text-white" : "bg-neutral-100"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
