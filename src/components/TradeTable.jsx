import React, { useEffect, useState } from 'react';
import Pagination from './Pagination';
import * as XLSX from 'xlsx';
import { useApi } from '../api.jsx';

export default function TradeTable() {
  const [rows, setRows] = useState([]);
  const [limit, setLimit] = useState(20);
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { get } = useApi();

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ limit, offset: 0, page });
        if (typeFilter !== 'all') params.append('trade_type', typeFilter);
        const data = await get(`/trades?${params.toString()}`);
        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error fetching trades:', e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
    const id = setInterval(fetchTrades, 60000);
    return () => clearInterval(id);
  }, [limit, typeFilter, page]);

  const exportXlsx = () => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Trades');
    XLSX.writeFile(wb, 'trades.xlsx');
  };

  // Safe number formatting
  const formatNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">Trade History</h2>
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
              <th>Amount</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>Profit %</th>
              <th>Tx</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-gray-800">
                <td className="py-1">{r.trade_type}</td>
                <td>{formatNumber(r.amount)}</td>
                <td>{r.entry_price}</td>
                <td>{r.exit_price}</td>
                <td className={r.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {formatNumber(r.profit)}
                </td>
                <td>
                  <a
                    href={`https://bscscan.com/tx/${r.tx_hash}`}
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    hash
                  </a>
                </td>
                <td>{new Date(r.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-2">
        <Pagination page={page} setPage={setPage} />
        <button onClick={exportXlsx} className="text-blue-400 hover:underline text-xs">Export XLSX</button>
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