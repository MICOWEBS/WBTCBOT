import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useApi } from '../api.jsx';

export default function PnLChart() {
  const [data, setData] = useState([]);
  const { get } = useApi();

  useEffect(() => {
    const fetchCurve = async () => {
      try {
        const curve = await get('/stats/equity');
        setData(curve.map((d) => ({
          equity: d.equity,
          date: new Date(d.timestamp).toLocaleDateString(),
        })));
      } catch (e) {
        console.error('Error fetching equity curve:', e);
      }
    };
    fetchCurve();
  }, []);

  if (!data.length) return null;

  return (
    <div className="bg-gray-800 rounded p-4 mt-4">
      <h3 className="font-semibold mb-2">Equity Curve</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="equity" stroke="#10b981" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 