import { useEffect, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export function useAuctionHub(auctionId, onBidReceived) {
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_SIGNALR_URL}`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    const start = async () => {
      try {
        await connection.start();
        await connection.invoke("JoinAuctionRoom", auctionId);

        connection.on("NewBidPlaced", (bid) => {
          onBidReceived(bid);
        });
      } catch (err) {
        console.error("SignalR Error:", err);
      }
    };

    start();

    return () => {
      connection.stop();
    };
  }, [auctionId, onBidReceived]);
}