import { useState } from 'react'
import { useAppStore } from '../store/useAppStore.js'

export default function Profile() {
  const user = useAppStore((s) => s.user)
  const setUser = useAppStore((s) => s.setUser)

  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)

  const save = (e) => {
    e.preventDefault()
    setUser({ name, email })
  }

  return (
    <main className="mx-auto max-w-xl px-4">
      <section className="py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">Profile</h1>

        <form onSubmit={save} className="bg-white rounded-xl ring-1 ring-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
            <input value={useAppStore.getState().points} disabled className="w-full rounded-md border-gray-300 bg-gray-50 text-sm" />
            <p className="text-xs text-gray-500 mt-1">Points are updated automatically based on activity.</p>
          </div>
          <div className="pt-2">
            <button type="submit" className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </section>
    </main>
  )
}
