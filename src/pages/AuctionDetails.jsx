import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import api from "../services/api";
import BidForm from "../components/BidForm";

export default function AuctionDetails() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setConnection] = useState(null);

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

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_SIGNALR_URL)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

      async function startConnection() {
        try {
          await newConnection.start();
          console.log("SignalR Connected.");

          await newConnection.invoke("JoinAuctionRoom", id);

          newConnection.on("NewBidPlaced", (bid) => {
            console.log("New bid received:", bid);
            setAuction((prevAuction) => ({
              ...prevAuction,
              currentPrice: bid.amount,
            }));
          });

          setConnection(newConnection);
        } catch (error) {
          console.error("Connection failed: ", error);
        }
      }
      
      startConnection();

      return () => {
        if (newConnection) {
          newConnection.stop();
        }
      };
  }, [id]);

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
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
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(auction.currentPrice)}
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
          <BidForm 
            auctionId={id} 
            currentPrice={auction.currentPrice} 
          />
        </div>

      </div>
    </div>
  );
}