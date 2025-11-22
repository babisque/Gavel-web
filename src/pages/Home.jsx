import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api';
import Skeleton from "../components/Skeleton";
import { Link } from "react-router-dom";

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
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center mb-8">
                <div className="text-2xl font-bold flex items-center gap-2">
                    <span>🔨</span> Gavel
                </div>
                <div className="flex gap-4">
                    <button className="text-gray-300 hover:text-white font-medium cursor-pointer">Login</button>
                    
                    <Link 
                        to="/register" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold transition"
                    >
                        Create Account
                    </Link>
                </div>
            </header>
            
            <div className="p-8 pt-0">
                <h1 className="text-4xl font-bold mb-8 text-center">Available Auctions</h1>

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
                                    className="w-full bg-green-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                                >
                                    Place a bid
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}