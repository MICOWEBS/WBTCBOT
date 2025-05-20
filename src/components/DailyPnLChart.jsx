import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useApi } from '../api.jsx';

export default function DailyPnLChart() {
  const [data, setData] = useState([]);
  const { get } = useApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rows = await get('/stats/daily');
        setData(rows.map((r) => ({ day: r.day, profit: r.profit_usd })));
      } catch (e) {
        console.error('Error fetching daily stats:', e);
      }
    };
    fetchData();
  }, []);

  if (!data.length) return null;

  return (
    <div className="bg-gray-800 rounded p-4 mt-4">
      <h3 className="font-semibold mb-2">Daily P&L (USD)</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data}>
          <XAxis dataKey="day" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Bar dataKey="profit" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 