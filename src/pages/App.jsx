import React from 'react';
import BotControl from '../components/BotControl';
import BotStatus from '../components/BotStatus';
import SignalTable from '../components/SignalTable';
import TradeTable from '../components/TradeTable';
import ProfitCard from '../components/ProfitCard';
import WalletCard from '../components/WalletCard';
import ThemeToggle from '../components/ThemeToggle';
import PnLChart from '../components/PnLChart';
import DailyPnLChart from '../components/DailyPnLChart';
import StatsCard from '../components/StatsCard';
import Login from './Login';
import { useAuth } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

function Header() {
  const { logout, user } = useAuth();
  return (
    <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          WBTC Scalping Bot
        </h1>
        <span className="hidden sm:inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
          Dashboard
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-gray-300 bg-gray-700/50 px-4 py-2 rounded-lg">
          {user}
        </span>
        <button 
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/20"
          onClick={logout}
        >
          Logout
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      <div className="max-w-screen-xl mx-auto p-4 sm:p-6">
      <Header />
        
        {/* Top Section - Bot Control and Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
      <BotControl />
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
      <BotStatus />
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-[1.02]">
      <ProfitCard />
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-[1.02]">
      <WalletCard />
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-[1.02]">
      <StatsCard />
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-[1.02]">
            <DailyPnLChart />
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Performance Overview
            </h2>
      <PnLChart />
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Recent Signals
            </h2>
        <SignalTable />
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Trade History
            </h2>
        <TradeTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { token } = useAuth();
  
  if (!token) {
    return <Login />;
  }
  
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
} 