'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

interface LeaderboardEntry {
  id: string;
  created_at: string;
  unique_name: string;
  total_co2_lifetime: number;
  percent_above_average: number;
  top_contributors: string[];
  recommendations: string[];
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'lowest' | 'highest'>('lowest');

  // Initialize Supabase client
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

      // Fetch leaderboard entries from Supabase
      const { data, error } = await supabase
        .from('carbon_leaderboard')
        .select('*')
        .order('total_co2_lifetime', { ascending: sortBy === 'lowest' })
        .limit(100);

      if (error) throw error;
      setEntries(data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
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

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fffe',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      backgroundColor: '#2ab985',
      color: 'white',
      padding: '20px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      margin: 0,
    },
    nav: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      transition: 'background-color 0.3s',
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
    },
    introSection: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      marginBottom: '30px',
      textAlign: 'center' as const,
    },
    controlsSection: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
      gap: '15px',
    },
    sortButton: {
      padding: '10px 20px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s',
    },
    sortButtonActive: {
      backgroundColor: '#2ab985',
      color: 'white',
    },
    sortButtonInactive: {
      backgroundColor: '#f3f4f6',
      color: '#6b7280',
    },
    entryCard: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      marginBottom: '20px',
      border: '1px solid #e5e7eb',
    },
    entryHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: '2px solid #f3f4f6',
    },
    rankBadge: {
      backgroundColor: '#fbbf24',
      color: '#92400e',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '600',
    },
    userName: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0,
    },
    entryDate: {
      color: '#6b7280',
      fontSize: '0.9rem',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '25px',
    },
    statCard: {
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center' as const,
    },
    statValue: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    statLabel: {
      fontSize: '0.9rem',
      opacity: 0.8,
    },
    sectionTitle: {
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '15px',
      color: '#374151',
    },
    contributorsList: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      flexWrap: 'wrap' as const,
    },
    contributorBadge: {
      backgroundColor: '#fef3c7',
      color: '#d97706',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    recommendationsList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    recommendationItem: {
      backgroundColor: '#f0fdf4',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '8px',
      borderLeft: '4px solid #22c55e',
    },
    emptyState: {
      textAlign: 'center' as const,
      padding: '60px 20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    emptyStateIcon: {
      fontSize: '4rem',
      marginBottom: '20px',
    },
    takeQuizButton: {
      backgroundColor: '#2ab985',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block',
      transition: 'background-color 0.3s',
    },
    loading: {
      textAlign: 'center' as const,
      padding: '60px 20px',
      fontSize: '1.1rem',
      color: '#6b7280',
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#dc2626',
      padding: '15px',
      borderRadius: '6px',
      marginBottom: '20px',
      textAlign: 'center' as const,
    },
  };

  const getRankSuffix = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={{ marginBottom: '20px' }}>🔄</div>
          Loading carbon footprint leaderboard...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>🌱 Carbon Tracker</h1>
          {/* Removed navigation buttons from the top */}
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.introSection}>
          <h2 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '2rem' }}>
            🏆 Global Carbon Footprint Leaderboard
          </h2>
          <p style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: '1.1rem' }}>
            See how people around the world are doing with their carbon emissions!
          </p>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Lower numbers mean better environmental impact. Take the quiz to join the leaderboard!
          </p>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {entries.length === 0 && !loading ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>🌍</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#374151' }}>
              No Entries Yet
            </h3>
            <p style={{ marginBottom: '25px', color: '#6b7280', fontSize: '1.1rem' }}>
              Be the first to take the carbon footprint quiz and appear on the leaderboard!
            </p>
            <Link href="/quiz" style={styles.takeQuizButton}>
              Take the Quiz 🌱
            </Link>
          </div>
        ) : (
          <div>
            <div style={styles.controlsSection}>
              <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#1f2937' }}>
                Showing {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSortBy('lowest')}
                  style={{
                    ...styles.sortButton,
                    ...(sortBy === 'lowest' ? styles.sortButtonActive : styles.sortButtonInactive)
                  }}
                >
                  🌱 Lowest First (Best)
                </button>
                <button
                  onClick={() => setSortBy('highest')}
                  style={{
                    ...styles.sortButton,
                    ...(sortBy === 'highest' ? styles.sortButtonActive : styles.sortButtonInactive)
                  }}
                >
                  🔥 Highest First
                </button>
              </div>
            </div>
            
            {entries.map((entry, index) => (
              <div key={entry.id} style={styles.entryCard}>
                <div style={styles.entryHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={styles.rankBadge}>
                      {getRankSuffix(index + 1)}
                    </span>
                    <h3 style={styles.userName}>
                      {entry.unique_name}
                    </h3>
                  </div>
                  <span style={styles.entryDate}>
                    {formatDate(entry.created_at)}
                  </span>
                </div>

                <div style={styles.statsGrid}>
                  <div style={{
                    ...styles.statCard,
                    backgroundColor: '#dbeafe',
                    color: '#1e40af'
                  }}>
                    <div style={styles.statValue}>
                      {entry.total_co2_lifetime} tonnes
                    </div>
                    <div style={styles.statLabel}>
                      Lifetime CO₂ Footprint
                    </div>
                  </div>

                  <div style={{
                    ...styles.statCard,
                    backgroundColor: entry.percent_above_average > 0 ? '#fee2e2' : '#dcfce7',
                    color: entry.percent_above_average > 0 ? '#dc2626' : '#16a34a'
                  }}>
                    <div style={styles.statValue}>
                      {entry.percent_above_average > 0 ? '+' : ''}{entry.percent_above_average}%
                    </div>
                    <div style={styles.statLabel}>
                      vs Global Average
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={styles.sectionTitle}>🎯 Top Contributors</h4>
                  <div style={styles.contributorsList}>
                    {entry.top_contributors.map((contributor, idx) => (
                      <span key={idx} style={styles.contributorBadge}>
                        #{idx + 1} {contributor}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={styles.sectionTitle}>💡 AI Recommendations</h4>
                  <ul style={styles.recommendationsList}>
                    {entry.recommendations.map((recommendation, idx) => (
                      <li key={idx} style={styles.recommendationItem}>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <Link href="/quiz" style={styles.takeQuizButton}>
                Join the Leaderboard 🌱
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}