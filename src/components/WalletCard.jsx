import React, { useEffect, useState } from 'react';
import { useApi } from '../api.jsx';

export default function WalletCard() {
  const [balances, setBalances] = useState({});
  const { get } = useApi();

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const data = await get('/wallet/balances');
        setBalances(data);
      } catch (e) {
        console.error('Error fetching balances:', e);
      }
    };
    fetchBalances();
    const id = setInterval(fetchBalances, 30000);
    return () => clearInterval(id);
  }, []);

  if (!balances) return null;

  return (
    <div className="bg-gray-800 rounded p-4 mt-4 inline-block text-sm">
      <h3 className="font-semibold mb-1">Wallet Balances</h3>
      <div>BNB: {Number(balances.BNB).toFixed(4)}</div>
      <div>WBTC: {Number(balances.WBTC).toFixed(6)}</div>
      <div>USDT: {Number(balances.USDT).toFixed(2)}</div>
    </div>
  );
} 