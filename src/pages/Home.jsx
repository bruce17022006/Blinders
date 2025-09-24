import { useMemo } from 'react'

const SDG_ITEMS = [
  {
    id: 1,
    name: 'No Poverty',
    desc: 'End poverty in all its forms everywhere.',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-01.jpg',
  },
  {
    id: 3,
    name: 'Good Health',
    desc: 'Ensure healthy lives and promote well-being for all.',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-03.jpg',
  },
  {
    id: 4,
    name: 'Quality Education',
    desc: 'Inclusive and equitable quality education for all.',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-04.jpg',
  },
  {
    id: 7,
    name: 'Affordable Energy',
    desc: 'Affordable, reliable and sustainable energy.',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg',
  },
  {
    id: 13,
    name: 'Climate Action',
    desc: 'Urgent action to combat climate change.',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
  },
]

export default function Home() {
  const items = useMemo(() => SDG_ITEMS, [])

  return (
    <main className="mx-auto max-w-7xl px-4">
      <section className="py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">Explore the SDGs</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 place-items-stretch">
          {items.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden h-[420px] flex flex-col transform transition-transform duration-300 hover:scale-105">
              <div className="absolute inset-x-0 -top-16 flex justify-center opacity-0 -translate-y-6 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-4">
                <img src="/vite.svg" alt="App mark" className="h-10 w-10 drop-shadow" />
              </div>

              <div className="h-1/2 w-full overflow-hidden">
                <img src={item.logo} alt={item.name} className="h-full w-full object-cover" />
              </div>

              <div className="h-1/2 p-5 flex flex-col">
                <div className="text-sm text-gray-500">SDG {item.id}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                {/* <div className="mt-auto pt-4">
                  <span className="inline-flex items-center text-indigo-600 text-sm font-medium">Learn more
                    <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L11 6.414V17a1 1 0 11-2 0V6.414L4.707 9.707A1 1 0 013.293 8.293l5-5z" clipRule="evenodd"/></svg>
                  </span>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
