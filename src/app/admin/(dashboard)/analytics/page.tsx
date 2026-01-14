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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const dynamic = 'force-dynamic';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgPagesPerSession: number;
  visitorsByPage: Array<{ page: string; count: number }>;
  visitorsByDay: Array<{ date: string; count: number }>;
  devices: Array<{ name: string; value: number }>;
  countries: Array<{ name: string; value: number }>;
  recentVisitors: Array<{
    id: number;
    page: string;
    userAgent: string;
    city: string;
    country: string;
    deviceType: string;
    browser: string;
    os: string;
    createdAt: string;
  }>;
}

const COLORS = ['#00f3ff', '#bc13fe', '#ff0080', '#ffffff', '#8884d8'];

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-secondary">Traffic & Engagement Overview</p>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="👁️"
          value={data.totalViews}
          label="Total Page Views"
          subLabel={`Last ${days} days`}
        />
        <StatCard
          icon="👥"
          value={data.uniqueVisitors}
          label="Unique Visitors"
          subLabel="Distinct Sessions"
        />
        <StatCard
          icon="📉"
          value={`${data.bounceRate}%`}
          label="Bounce Rate"
          subLabel="Single Page Sessions"
          color="text-neon-pink"
        />
        <StatCard
          icon="🧭"
          value={data.avgPagesPerSession}
          label="Avg. Session Depth"
          subLabel="Pages per visit"
          color="text-neon-blue"
        />
        <StatCard
          icon="📱"
          value={data.devices[0]?.name || 'Desktop'}
          label="Top Device"
          subLabel="Most popular platform"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors Over Time */}
        <div className="bg-tertiary rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-6">Traffic Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.visitorsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#100d25', border: '1px solid #333' }} />
                <Line type="monotone" dataKey="count" stroke="#bc13fe" strokeWidth={3} dot={{ r: 4, fill: '#bc13fe' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-tertiary rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-6">Device Breakdown</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.devices}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.devices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#100d25', border: '1px solid #333' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-tertiary rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-6">Top Pages</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.visitorsByPage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#888" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="page" width={100} stroke="#888" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#100d25', border: '1px solid #333' }} />
                <Bar dataKey="count" fill="#00f3ff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-tertiary rounded-2xl p-6 border border-white/10">
          <h2 className="text-lg font-bold text-white mb-6">Top Countries</h2>
          <div className="space-y-4">
            {data.countries.map((country, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{idx + 1}</span>
                  <span className="text-white font-medium">{country.name === 'Unknown' ? 'Unknown Location' : country.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-black-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neon-purple"
                      style={{ width: `${(country.value / data.totalViews) * 100}%` }}
                    />
                  </div>
                  <span className="text-secondary w-12 text-right">{country.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Visitors Table */}
      <div className="bg-tertiary rounded-2xl p-6 border border-white/10 overflow-hidden">
        <h2 className="text-lg font-bold text-white mb-6">Recent Sessions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-secondary text-sm">
                <th className="py-3 font-medium">Location</th>
                <th className="py-3 font-medium">Page</th>
                <th className="py-3 font-medium">Device / OS</th>
                <th className="py-3 font-medium">Browser</th>
                <th className="py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {data.recentVisitors.map((visitor) => (
                <tr key={visitor.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 text-white">
                    {visitor.city && visitor.city !== 'Unknown' ? `${visitor.city}, ` : ''}
                    {visitor.country || 'Unknown'}
                  </td>
                  <td className="py-3 text-neon-blue">{visitor.page}</td>
                  <td className="py-3 text-secondary">
                    {visitor.deviceType} <span className="text-xs opacity-50">• {visitor.os}</span>
                  </td>
                  <td className="py-3 text-secondary">{visitor.browser}</td>
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

function StatCard({ icon, value, label, subLabel, color = "text-white" }: any) {
  return (
    <div className="bg-tertiary p-6 rounded-2xl border border-white/10 hover:border-neon-purple/30 transition-all group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${color} mb-1`}>{value}</p>
      <p className="text-white font-medium">{label}</p>
      <p className="text-secondary text-xs mt-1">{subLabel}</p>
    </div>
  );
}
