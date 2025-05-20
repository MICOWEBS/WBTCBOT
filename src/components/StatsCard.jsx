import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';

export default function StatsCard() {
  const [stats, setStats] = useState({
    win_rate: 0,
    average_trade_usd: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          return;
        }

        const res = await fetch(`${API_URL}/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setStats({
          win_rate: Number(data?.win_rate ?? 0),
          average_trade_usd: Number(data?.average_trade_usd ?? 0)
        });
      } catch (e) {
        console.error('Error fetching stats:', e);
        // Keep default values on error
      }
    };

    fetchStats();
    const id = setInterval(fetchStats, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-gray-800 rounded p-4 mt-4 inline-block text-sm">
      <div>Win rate: {stats.win_rate.toFixed(1)}%</div>
      <div>Avg trade: {stats.average_trade_usd.toFixed(2)} USD</div>
    </div>
  );
} 