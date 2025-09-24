import React from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '../store';

// We'll define the SDG data right here in the component
const SDG_ITEMS = [
    {
        id: 2,
        name: 'Zero Hunger',
        desc: 'End hunger, achieve food security and improved nutrition and promote sustainable agriculture.',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-02.jpg',
        gameRoute: '/game', // Link for our active game
    },
    {
        id: 6,
        name: 'Clean Water And Sanitation',
        desc: 'Ensure availability and sustainable management of water and sanitation for all.',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg',
    },
    {
        id: 7,
        name: 'Affordable And Clean Energy',
        desc: 'Ensure access to affordable, reliable, sustainable and modern energy for all.',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg',
    },
    {
        id: 12,
        name: 'Responsible Consumption And Production',
        desc: 'Ensure sustainable consumption and production patterns.',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg',
    },
    {
        id: 14,
        name: 'Life Below Water',
        desc: 'Conserve and sustainably use the oceans, seas and marine resources for sustainable development.',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-14.jpg',
    },
];

// A reusable component for the SDG cards to keep the main return clean
const SdgCard = ({ item }) => {
    const content = (
        <>
            <div className="h-1/2 w-full overflow-hidden">
                <img src={item.logo} alt={item.name} className="h-full w-full object-cover" />
            </div>
            <div className="h-1/2 p-5 flex flex-col">
                <div className="text-sm text-gray-500">SDG {item.id}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed flex-grow">{item.desc}</p>
                <div className="mt-auto pt-4">
                    {item.gameRoute ? (
                        <span className="inline-flex items-center text-indigo-600 text-sm font-medium">
                            Play Now &rarr;
                        </span>
                    ) : (
                        <span className="inline-flex items-center text-gray-400 text-sm font-medium">
                            Coming Soon
                        </span>
                    )}
                </div>
            </div>
        </>
    );

    if (item.gameRoute) {
        return (
            <Link to={item.gameRoute} className="group relative bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden h-[420px] flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                {content}
            </Link>
        );
    }

    return (
        <div className="group relative bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden h-[420px] flex flex-col opacity-60 cursor-not-allowed">
            {content}
        </div>
    );
};


export default function Home() {
    const user = useGameStore((state) => state.user);

    return (
        <main className="mx-auto max-w-7xl px-4">
            <section className="py-8 md:py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-gray-900">Explore the SDGs</h1>
                <p className="text-center text-lg text-gray-600 mb-10">
                    Welcome, {user?.name}! Choose a goal to start playing.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {SDG_ITEMS.map((item) => (
                        <SdgCard key={item.id} item={item} />
                    ))}
                </div>
            </section>
        </main>
    )
}

