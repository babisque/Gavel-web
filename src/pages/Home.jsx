import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from '../services/api';
import Navbar from '../components/Navbar';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-700/50 rounded ${className}`} />
);

export default function Home() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAuctions() {
            try {
                const response = await api.get('AuctionItem');
                setAuctions(response.data.items);
            } catch (error) {
                console.error('Error fetching auctions:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchAuctions();
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-gavel-green/30">            
            <Navbar />

            <div className="relative pt-32 pb-20 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-gavel-green/20 blur-[120px] rounded-full pointer-events-none opacity-20" />
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-gray-800/50 border border-gray-700 text-gavel-green text-xs font-semibold mb-6">
                        REAL-TIME AUCTIONS
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
                        Discover extraordinary <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gavel-green to-emerald-400">
                            items.
                        </span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
                        Join exciting disputes for electronics, antiques, and exclusive items. 
                        Place your bid and secure the best price.
                    </p>
                </div>
            </div>

            {/* --- AUCTION GRID --- */}
            <main className="max-w-7xl mx-auto px-6 pb-24">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Active Auctions
                    </h2>
                    
                    <div className="hidden md:block relative w-64">
                        <input 
                            disabled
                            placeholder="Search items..." 
                            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2 pl-4 pr-10 text-sm text-gray-400 cursor-not-allowed"
                        />
                        <svg className="w-4 h-4 text-gray-600 absolute right-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="bg-[#121212] rounded-2xl p-5 border border-gray-800 h-[380px] flex flex-col justify-between">
                                <div className="space-y-4">
                                    <Skeleton className="h-40 w-full rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-between items-center border-t border-gray-800 mt-4">
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {auctions.map((item) => (
                            <div 
                                key={item.id} 
                                className="group relative bg-[#121212] rounded-2xl border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                {/* Image Placeholder */}
                                <div className="aspect-[4/3] bg-gray-800 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-60" />
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                                        {new Date(item.endTime) > new Date() ? 'LIVE' : 'ENDED'}
                                    </div>
                                    
                                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                                        📦
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-white mb-1 truncate" title={item.name}>
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mb-4">
                                        {item.description || "No description available."}
                                    </p>

                                    <div className="flex items-end justify-between border-t border-gray-800 pt-4">
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium uppercase mb-1">Current Price</p>
                                            <p className="text-xl font-bold text-gavel-green">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.currentPrice)}
                                            </p>
                                        </div>
                                        
                                        <button
                                            onClick={() => navigate(`/auction/${item.id}`)}
                                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gavel-green hover:scale-110 transition-all shadow-lg cursor-pointer"
                                            title="Place a bid"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}