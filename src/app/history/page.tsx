'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js'; // Directly connect to supabase
import '../globals.css'; // GLOBAL STYLES

interface LeaderboardEntry { ///Defines columns in each record in the Leaderboard

  id: string;
  created_at: string; //timestamp
  unique_name: string;
  total_co2_lifetime: number;
  percent_above_average: number; //percent just a number float in tons
  top_contributors: string[]; //of a type array
  recommendations: string[];

}

export default function LeaderboardPage() {

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<'lowest' | 'highest'>('lowest');

  // Connnect to supabase client via .env
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('carbon_leaderboard')
        .select('*')
        .order('total_co2_lifetime', { ascending: sortBy === 'lowest' })
        .limit(100);

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      setError('Failed to load leaderboard. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRankSuffix = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen py-10 bg-transparent"> {/* bg handled by globals.css */}
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold text-green-700 mb-2 text-center font-serif">🌱 Carbon Tracker Leaderboard</h1>
        <p className="text-gray-600 text-center mb-6">
          See how other people are doing with their environmental impact. <br />
          <span className="font-semibold">Note: Lower is better!</span>
        </p>

        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setSortBy('lowest')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              sortBy === 'lowest'
                ? 'bg-green-700 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-green-100'
            }`}
          >
            Lowest First
          </button>
          <button
            onClick={() => setSortBy('highest')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              sortBy === 'highest'
                ? 'bg-green-700 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-green-100'
            }`}
          >
            Highest First
          </button>
        </div>

        {loading && (
          <div className="text-center text-gray-500 py-10">The carbon footprint leaderboard is loading...</div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="text-center py-10">
            <div className="text-4xl mb-2">🌍</div>
            <div className="text-lg font-semibold mb-2">No Entries Yet</div>
            <p className="text-gray-600 mb-4">
              Be the first to take the carbon footprint quiz and appear on the leaderboard!
            </p>
            <Link
              href="/quiz"
              className="inline-block px-6 py-2 bg-green-700 text-white rounded font-medium hover:bg-green-600 transition-colors"
            >
              Take the Quiz 🌱
            </Link>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2 bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-green-700">{getRankSuffix(index + 1)}</span>
                    <span className="font-semibold text-gray-800">{entry.unique_name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(entry.created_at)}</span>
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex flex-col items-center flex-1 min-w-[120px]">
                    <span className="text-xl font-bold text-blue-700">{entry.total_co2_lifetime} t</span>
                    <span className="text-xs text-gray-500">Lifetime CO₂</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 min-w-[120px]">
                    <span className={`text-xl font-bold ${entry.percent_above_average > 0 ? 'text-red-700' : 'text-green-700'}`}>
                      {entry.percent_above_average > 0 ? '+' : ''}
                      {entry.percent_above_average}%
                    </span>
                    <span className="text-xs text-gray-500">vs Global Avg</span>
                  </div>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">Top Contributors:</span>
                  <div className="flex flex-wrap gap-2">
                    {entry.top_contributors.map((contributor, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        #{idx + 1} {contributor}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">AI Recommendations:</span>
                  <ul className="list-disc ml-5 text-sm text-gray-700">
                    {entry.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            <div className="text-center mt-6">
              <Link
                href="/quiz"
                className="inline-block px-6 py-2 bg-green-700 text-white rounded font-medium hover:bg-green-600 transition-colors"
              >
                Press to do the quiz yourself
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}