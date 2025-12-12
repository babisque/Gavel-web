import { useState } from "react";
import api from "../services/api";

export default function BidForm({ auctionId, currentPrice }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const bidAmount = parseFloat(amount);
    
    if (!bidAmount || bidAmount <= currentPrice) {
      return setError("Bid must be higher than current price.");
    }

    setLoading(true);

    try {
      await api.post("/Bid", {
        auctionItemId: auctionId,
        amount: bidAmount,
      });

      setSuccess("Bid placed successfully!");
      setAmount("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const msg = err.response?.data?.detail || "Error processing bid.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-[#1a1a1a] p-6 rounded-2xl border border-gray-800 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Place a Bid</h2>
        <span className="px-2 py-1 bg-gavel-green/10 text-gavel-green text-xs font-bold rounded uppercase">
            Live
        </span>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-lg mb-4 text-sm">
          {success}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
          Your Offer ($)
        </label>
        <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
            <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-8 pr-4 py-3 text-white font-mono text-lg placeholder-gray-600 focus:outline-none focus:border-gavel-green focus:ring-1 focus:ring-gavel-green transition-all"
            placeholder={(currentPrice + 1).toFixed(2)}
            />
        </div>
        <p className="text-right text-xs text-gray-600 mt-2">
            Minimum bid: ${(currentPrice + 0.01).toFixed(2)}
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 px-4 rounded-xl font-bold text-black transition-all transform hover:scale-[1.02] active:scale-[0.98]
            ${
              loading
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-gavel-green hover:bg-emerald-400 shadow-lg shadow-green-900/20"
            }`}
      >
        {loading ? "Processing..." : "CONFIRM BID"}
      </button>
    </form>
  );
}