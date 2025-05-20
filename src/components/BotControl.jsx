import React, { useState } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

export default function BotControl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const handleAction = async (action) => {
    if (!token) {
      setError('Not authenticated');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/bot/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      await res.json();
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => handleAction('start')}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading || !token}
      >
        {loading ? 'Processing...' : 'Start Bot'}
      </button>
      <button
        onClick={() => handleAction('stop')}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading || !token}
      >
        {loading ? 'Processing...' : 'Stop Bot'}
      </button>
      {error && <span className="text-red-400 ml-2">{error}</span>}
    </div>
  );
} 