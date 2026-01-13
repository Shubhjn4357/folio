'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export const dynamic = 'force-dynamic';

interface AnalyticsData {
  totalVisitors: number;
  visitorsByPage: Array<{ page: string; count: number }>;
  visitorsByDay: Array<{ date: string; count: number }>;
  recentVisitors: Array<{
    id: number;
    page: string;
    userAgent: string;
    createdAt: string;
  }>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/analytics?days=${days}`);
      const analyticsData = await res.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-secondary">Failed to load analytics</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-secondary">Track your portfolio visitors</p>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          className="px-4 py-2 bg-tertiary border border-white/10 rounded-lg text-white"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Stats Card */}
      <div className="bg-tertiary rounded-2xl p-6 border border-white/10 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl">👁️</span>
          <div>
            <p className="text-4xl font-bold text-white">{data.totalVisitors}</p>
            <p className="text-secondary">Total Visitors (Last {days} days)</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Visitors Over Time */}
        <div className="bg-tertiary rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-4">Visitors Over Time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.visitorsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="date"
                  stroke="#888"
                  tick={{ fill: '#888', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#888" tick={{ fill: '#888', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#bc13fe"
                  strokeWidth={2}
                  dot={{ fill: '#bc13fe' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-tertiary rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-4">Top Pages</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.visitorsByPage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" tick={{ fill: '#888', fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="page"
                  stroke="#888"
                  tick={{ fill: '#888', fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#00f3ff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Visitors */}
      <div className="bg-tertiary rounded-2xl p-6 border border-white/10">
        <h2 className="text-lg font-bold text-white mb-4">Recent Visitors</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 text-secondary font-medium">Page</th>
                <th className="text-left py-3 text-secondary font-medium">Device</th>
                <th className="text-left py-3 text-secondary font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {data.recentVisitors.map((visitor) => (
                <tr key={visitor.id} className="border-b border-white/5">
                  <td className="py-3 text-white">{visitor.page}</td>
                  <td className="py-3 text-secondary text-sm truncate max-w-xs">
                    {visitor.userAgent?.includes('Mobile') ? '📱 Mobile' : '💻 Desktop'}
                  </td>
                  <td className="py-3 text-secondary text-sm">
                    {new Date(visitor.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
