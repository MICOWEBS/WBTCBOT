import React, { useEffect, useState } from 'react';
import { useApi } from '../api.jsx';

export default function ProfitCard() {
  const [profit, setProfit] = useState(0);
  const [profitUsd, setProfitUsd] = useState(0);
  const { get } = useApi();

  useEffect(() => {
    const fetchProfit = async () => {
      try {
        const data = await get('/stats');
        setProfit(Number(data?.total_profit ?? 0));
        setProfitUsd(Number(data?.total_profit_usd ?? 0));
      } catch (e) {
        console.error('Error fetching profit:', e);
      }
    };
    fetchProfit();
    const id = setInterval(fetchProfit, 30000);
    return () => clearInterval(id);
  }, []);

  // Ensure we have valid numbers before using them
  const safeProfit = Number(profit ?? 0);
  const safeProfitUsd = Number(profitUsd ?? 0);
  const color = safeProfit >= 0 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-gray-800 rounded p-4 mt-4 inline-block">
      <span className="mr-2 font-semibold">Total P&L:</span>
      <span className={color}>{safeProfit.toFixed(2)}%</span>
      <span className="ml-4">({safeProfitUsd.toFixed(2)} USD)</span>
    </div>
  );
} 