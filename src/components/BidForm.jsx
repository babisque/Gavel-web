import { useState } from "react";
import api from "../services/api";

export default function BidForm({ auctionId, currentPrice }) {
  const [amount, setAmount] = useState("");
  const [bidderName, setBidderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const bidAmount = parseFloat(amount);
    if (!bidderName) return setError("Please enter your name.");
    if (!bidAmount || bidAmount <= currentPrice) {
      return setError("The bid amount must be greater than the current price.");
    }

    setLoading(true);

    try {
      await api.post("/Bid", {
        auctionItemId: auctionId,
        bidderName: bidderName,
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
      className="w-full max-w-sm bg-gray-800 p-6 rounded-lg border border-gray-700"
    >
      <h2 className="text-xl font-bold mb-4 text-white">Make your bid 💰</h2>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900/50 border border-green-500 text-green-200 p-3 rounded mb-4 text-sm">
          {success}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-400 text-sm font-bold mb-2">
          Your Name
        </label>
        <input
          type="text"
          value={bidderName}
          onChange={(e) => setBidderName(e.target.value)}
          className="w-full p-3 bg-gray-900 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none"
          placeholder="Ex: John Doe"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-400 text-sm font-bold mb-2">
          Bid Amount ($)
        </label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 bg-gray-900 text-white rounded border border-gray-600 focus:border-green-500 focus:outline-none"
          placeholder={`Minimum: ${(currentPrice + 1).toFixed(2)}`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full font-bold py-3 px-4 rounded text-white transition duration-200
            ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 cursor-pointer"
            }`}
      >
        {loading ? "Sending..." : "PLACE BID"}
      </button>
    </form>
  );
}
