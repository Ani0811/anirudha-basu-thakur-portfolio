'use client';

import { useEffect, useState } from 'react';

interface GitHubStatsData {
  username: string;
  publicRepos: number;
  totalCommits: number;
  totalContributions: number;
  topLanguages: string[];
  createdAt: string;
}

interface GithubStatsProps {
  username: string;
}

export default function GithubStats({ username }: GithubStatsProps) {
  const [stats, setStats] = useState<GitHubStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/github/stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch GitHub stats');
        }

        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchStats();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm animate-pulse"
          >
            <div className="h-12 bg-white/10 rounded mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        icon="📦"
        label="Repositories"
        value={(stats.publicRepos ?? 0).toLocaleString()}
      />
      <StatCard
        icon="💻"
        label="Total Commits"
        value={(stats.totalCommits ?? 0).toLocaleString()}
      />
      <StatCard
        icon="📊"
        label="Contributions"
        value={(stats.totalContributions ?? 0).toLocaleString()}
      />
      <StatCard
        icon="🔥"
        label="Active Projects"
        value={Math.min((stats.publicRepos ?? 0), 10).toLocaleString()}
      />
    </div>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="group p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-500 hover:bg-white/10 relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-4xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-all duration-300 group-hover:scale-110 transform">
          {value}
        </div>
        <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-2">
          <span className="text-base">{icon}</span>
          {label}
        </div>
      </div>
      
      {/* Pulsing corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-cyan-500/0 via-cyan-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-linear-to-tr from-blue-500/0 via-blue-500/10 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}
