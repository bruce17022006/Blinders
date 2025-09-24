import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore.js'

export default function LeaderBoard() {
  const points = useAppStore((s) => s.points)
  const user = useAppStore((s) => s.user)

  const rows = useMemo(() => {
    const others = [
      { name: 'Ava', points: 220 },
      { name: 'Noah', points: 510 },
      { name: 'Mia', points: 150 },
      { name: 'Liam', points: 360 },
      { name: 'Zoe', points: 420 },
    ]
    const list = [...others, { name: user.name || 'You', points }]
    return list
      .sort((a, b) => b.points - a.points)
      .map((r, idx) => ({ ...r, rank: idx + 1 }))
  }, [points, user.name])

  return (
    <main className="mx-auto max-w-4xl px-4">
      <section className="py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">LeaderBoard</h1>
        <div className="overflow-hidden rounded-xl ring-1 ring-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">User</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((r, idx) => (
                <tr key={`${r.name}-${r.points}-${idx}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{r.rank}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
