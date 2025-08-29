import { getAllExchanges } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function HistoryPage() {
  const items = await getAllExchanges()
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">History (stored in MongoDB)</h2>
      <ul className="grid gap-3">
        {items.length === 0 && <li className="text-sm text-neutral-600">No history yet.</li>}
        {items.map((it) => (
          <li key={it._id.toString()} className="rounded-2xl border p-4">
            <p className="text-sm mb-2"><span className="font-semibold">Q:</span> {it.question}</p>
            <p className="text-sm"><span className="font-semibold">A:</span> {it.answer}</p>
            <p className="mt-2 text-xs text-neutral-500">{new Date(it.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}