import React, { useEffect, useState } from 'react';
import { WS_URL } from '../config';

const socketUrl = `${WS_URL}/ws`;
const INITIAL_RECONNECT_DELAY = 1000;    // Start with 1 second
const MAX_RECONNECT_DELAY = 30000;       // Max 30 seconds

export default function BotStatus() {
  const [status, setStatus] = useState('unknown');
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    let ws = null;
    let reconnectTimeout = null;
    let reconnectAttempts = 0;

    const getReconnectDelay = (attempt) => {
      const delay = Math.min(INITIAL_RECONNECT_DELAY * Math.pow(2, attempt), MAX_RECONNECT_DELAY);
      return delay + Math.random() * 1000; // Add jitter
    };

    const connect = () => {
      if (isConnecting) return;
      
      try {
        setIsConnecting(true);
        ws = new WebSocket(socketUrl);
        
        ws.onopen = () => {
          setError(null);
          setIsConnecting(false);
          reconnectAttempts = 0;
          console.log('WebSocket connected');
        };

        ws.onmessage = (evt) => {
          try {
            const data = JSON.parse(evt.data);
            setStatus(data.status);
          } catch (e) {
            console.error('Error parsing WebSocket message:', e);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setError('Connection error');
          setIsConnecting(false);
        };

        ws.onclose = () => {
          setIsConnecting(false);
          const delay = getReconnectDelay(reconnectAttempts);
          console.log(`WebSocket closed, attempting to reconnect in ${Math.round(delay/1000)}s...`);
          reconnectAttempts++;
          reconnectTimeout = setTimeout(connect, delay);
        };
      } catch (e) {
        console.error('Error creating WebSocket:', e);
        setError('Connection error');
        setIsConnecting(false);
        const delay = getReconnectDelay(reconnectAttempts);
        reconnectAttempts++;
        reconnectTimeout = setTimeout(connect, delay);
      }
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  return (
    <div className="mt-4">
      <span className="mr-2 font-semibold">Bot Status:</span>
      <span
        className={
          status === 'running' ? 'text-green-400' : status === 'stopped' ? 'text-yellow-400' : 'text-gray-400'
        }
      >
        {isConnecting ? 'connecting...' : status}
      </span>
      {error && <span className="ml-2 text-red-400">{error}</span>}
    </div>
  );
} 