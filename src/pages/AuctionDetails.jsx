import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import api from '../services/api';
import Navbar from '../components/Navbar';
import BidForm from '../components/BidForm';

export default function AuctionDetails() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    async function fetchAuction() {
      try {
        const response = await api.get(`AuctionItem/${id}`);
        setAuction(response.data);
      } catch (error) {
        console.error("Error fetching details", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAuction();
  }, [id]);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5065/hubs/bidHub")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    async function startConnection() {
      try {
        await newConnection.start();
        await newConnection.invoke("JoinAuctionRoom", id);

        newConnection.on("NewBidPlaced", (bid) => {
          setAuction(prev => ({
            ...prev,
            currentPrice: bid.amount
          }));
        });

        setConnection(newConnection);
      } catch (e) {
        console.error("SignalR failed", e);
      }
    }

    startConnection();

    return () => {
      if (newConnection) newConnection.stop();
    };
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gavel-green"></div>
    </div>
  );

  if (!auction) return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl font-bold mb-4">Auction Not Found</h2>
        <a href="/" className="text-gavel-green hover:underline">Go Home</a>
    </div>
  );

  const isActive = new Date(auction.endTime) > new Date();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-gavel-green/30">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-8 space-y-8">
                <div className="aspect-video bg-[#121212] rounded-3xl border border-gray-800 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-50" />
                    <span className="text-9xl opacity-20 group-hover:scale-110 transition-transform duration-700">📦</span>
                    
                    <div className="absolute top-6 right-6">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold border ${isActive ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                            {isActive ? '● LIVE AUCTION' : 'ENDED'}
                        </span>
                    </div>
                </div>

                <div className="bg-[#121212] rounded-3xl p-8 border border-gray-800">
                    <h1 className="text-4xl font-bold text-white mb-6">{auction.name}</h1>
                    
                    <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-800">
                        <div>
                            <span className="block text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">Current Price</span>
                            <div className="text-5xl font-bold text-white tabular-nums tracking-tight">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(auction.currentPrice)}
                            </div>
                        </div>
                        <div>
                            <span className="block text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">Ends At</span>
                            <div className="text-2xl font-medium text-gray-300">
                                {new Date(auction.endTime).toLocaleDateString()}
                                <span className="block text-base text-gray-500">{new Date(auction.endTime).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-4">Description</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            {auction.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-32">
                    <BidForm 
                        auctionId={id} 
                        currentPrice={auction.currentPrice} 
                    />
                    
                    <div className="mt-6 p-6 rounded-2xl bg-[#121212] border border-gray-800 text-center">
                        <p className="text-gray-500 text-sm mb-2">Need help?</p>
                        <a href="#" className="text-gavel-green font-medium hover:underline">View Auction Rules</a>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}