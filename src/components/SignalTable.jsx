import React, { useEffect, useState } from 'react';
import Pagination from './Pagination';
import { useApi } from '../api.jsx';

export default function SignalTable() {
  const [rows, setRows] = useState([]);
  const [limit, setLimit] = useState(20);
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const { get } = useApi();

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const params = new URLSearchParams({ limit, offset: 0 });
        if (typeFilter !== 'all') params.append('type', typeFilter);
        params.append('page', page);
        const data = await get(`/signals?${params.toString()}`);
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error fetching signals:', e);
        setRows([]);
      }
    };
    fetchSignals();
    const id = setInterval(fetchSignals, 60000);
    return () => clearInterval(id);
  }, [limit, typeFilter, page]);

  // Ensure we have valid numbers before using them
  const formatNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/signals/csv', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'signals.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error('Error exporting CSV:', e);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">Recent Signals</h2>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
        >
          <option value="all">All</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="text-gray-400">
            <tr>
              <th>Type</th>
              <th>RSI</th>
              <th>EMA</th>
              <th>Spread %</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-gray-800">
                <td className="py-1">{r.type}</td>
                <td>{formatNumber(r.rsi)}</td>
                <td>{formatNumber(r.ema)}</td>
                <td>{formatNumber(r.price_spread)}</td>
                <td>{new Date(r.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-2">
        <Pagination page={page} setPage={setPage} />
        <button
          onClick={handleExportCSV}
          className="text-blue-400 hover:underline text-xs"
        >
          Export CSV
        </button>
      </div>
      <button
        onClick={() => setLimit((l) => l + 20)}
        className="mt-2 text-blue-400 hover:underline text-sm"
      >
        Load more
      </button>
    </div>
  );
} 