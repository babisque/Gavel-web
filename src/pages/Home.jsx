import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api';
import Skeleton from "../components/Skeleton";
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
        <div className="min-h-screen bg-gray-900 p-8 text-white">
            <h1 className="text-4xl font-bold mb-8 text-center">🔨 Active auctions</h1>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-lg h-64 flex flex-col justify-between">
                            <div>
                                <Skeleton className="h-8 w-3/4 mb-4" />
                                <Skeleton className="h-4 w-1/4 mb-4" />
                                <Skeleton className="h-10 w-1/2" />
                            </div>
                            <Skeleton className="h-10 w-full mt-6" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map((item) => (
                        <div key={item.id} className="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-750 transition">
                            <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                            <p className="text-gray-400 mb-4">Current price</p>
                            <p className="text-3xl font-bold text-green-400 mb-6">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.currentPrice)}
                            </p>
                            <button
                                onClick={() => navigate(`/auction/${item.id}`)}
                                className="w-full bg-green-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Place a bid
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}