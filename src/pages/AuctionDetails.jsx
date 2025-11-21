import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import BidForm from "../components/BidForm";
import { formatCurrency } from "../utils/format";
import { useAuctionHub } from "../hooks/useAuctionHub";
import Skeleton from "../components/Skeleton";

export default function AuctionDetails() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuction() {
      try {
        const response = await api.get(`/AuctionItem/${id}`);
        setAuction(response.data);
      } catch (error) {
        console.error("Error fetching auction details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAuction();
  }, [id]);

  useAuctionHub(id, 
    (bid) => {
      setAuction((prev) => ({ ...prev, currentPrice: bid.amount }));
    },
    () => {
      setAuction((prev) => ({ ...prev, status: 2 }));
    }
  );
    

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex justify-center">
        <div className="max-w-5xl w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="p-8">
            <Skeleton className="h-10 w-3/4 mb-6" />
          
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-8" />

            <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
               <Skeleton className="h-4 w-1/4 mb-2" />
               <Skeleton className="h-12 w-1/2" />
            </div>
          </div>

          <div className="bg-gray-750 p-8 flex flex-col justify-center items-center border-l border-gray-700">
             <div className="w-full max-w-sm">
                <Skeleton className="h-8 w-2/3 mb-6" />
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-12 w-full mb-6" />
                <Skeleton className="h-12 w-full" />
             </div>
          </div>
        </div>
      </div>
    );
  }
  if (!auction) return <div className="text-white text-center mt-10">Auction not found.</div>;
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex justify-center">
      <div className="max-w-5xl w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">{auction.name}</h1>
          <p className="text-gray-400 mb-6">{auction.description}</p>
          
          <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <span className="text-sm text-gray-500 uppercase tracking-wider">Current price</span>
            <div className="text-5xl font-bold text-green-400 mt-2 transition-all duration-300">
              {formatCurrency(auction.currentPrice)}
            </div>
          </div>

          <div className="mb-6">
             <span className="text-sm text-gray-500 uppercase tracking-wider">Ends at</span>
             <div className="text-xl font-semibold mt-1 text-gray-300">
               {new Date(auction.endTime).toLocaleString()}
             </div>
          </div>
        </div>

        <div className="bg-gray-750 p-8 flex flex-col justify-center items-center border-l border-gray-700">
          {auction.status !== 2 ? (
            <BidForm 
              auctionId={id} 
              currentPrice={auction.currentPrice} 
            />
          ) : (
            <div className="text-center text-red-500 font-semibold">This auction has ended.</div>
          )}
        </div>
      </div>
    </div>
  );
}