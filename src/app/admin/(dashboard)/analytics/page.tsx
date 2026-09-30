'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  FaEye,
  FaUsers,
  FaArrowTrendDown,
  FaCompass,
  FaMobileScreen,
  FaCalendarDays,
} from 'react-icons/fa6';
import { CustomSelect, SelectOption } from '@/components/ui';
import { AdminAnalyticsSkeleton } from '@/components/ui/Skeleton';
import { fetchAnalytics as getAnalyticsData, AnalyticsData } from '@/services';

const TrafficVelocityChart = dynamic(
  () => import('@/components/dashboard/AnalyticsCharts').then((mod) => mod.TrafficVelocityChart),
  {
    ssr: false,
    loading: () => <div className="h-72 w-full animate-pulse bg-black/5 dark:bg-white/5 rounded-2xl" />,
  }
);

const DeviceSharesChart = dynamic(
  () => import('@/components/dashboard/AnalyticsCharts').then((mod) => mod.DeviceSharesChart),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full animate-pulse bg-black/5 dark:bg-white/5 rounded-2xl" />,
  }
);

const TopPagesChart = dynamic(
  () => import('@/components/dashboard/AnalyticsCharts').then((mod) => mod.TopPagesChart),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full animate-pulse bg-black/5 dark:bg-white/5 rounded-2xl" />,
  }
);

const DAY_OPTIONS: SelectOption<number>[] = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await getAnalyticsData(days);
      setData(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <AdminAnalyticsSkeleton />;
  }

  if (!data) {
    return <p className="text-secondary text-sm">Failed to load analytics data.</p>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-black/5 dark:border-white/5">
        <div>
          <span className="mono-label text-neon-blue">Traffic & Insights</span>
          <h1 className="font-display font-semibold text-3xl sm:text-4xl text-[var(--text-main)] mt-1">
            Telemetry Analytics
          </h1>
          <p className="text-secondary text-xs sm:text-sm mt-1">
            Visitor tracking, session depth, and regional traffic breakdown.
          </p>
        </div>

        <CustomSelect
          value={days}
          onChange={(newDays) => setDays(newDays)}
          options={DAY_OPTIONS}
          icon={<FaCalendarDays className="w-3.5 h-3.5 text-neon-blue" />}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={FaEye}
          value={data.totalViews}
          label="Total Page Views"
          subLabel={`Past ${days} days`}
          accent="text-neon-blue"
        />
        <StatCard
          icon={FaUsers}
          value={data.uniqueVisitors}
          label="Unique Visitors"
          subLabel="Discrete sessions"
          accent="text-neon-purple"
        />
        <StatCard
          icon={FaArrowTrendDown}
          value={`${data.bounceRate}%`}
          label="Bounce Rate"
          subLabel="Single page visits"
          accent="text-neon-pink"
        />
        <StatCard
          icon={FaCompass}
          value={data.avgPagesPerSession}
          label="Session Depth"
          subLabel="Avg pages per visit"
          accent="text-emerald-500"
        />
        <StatCard
          icon={FaMobileScreen}
          value={data.devices[0]?.name || 'Desktop'}
          label="Top Platform"
          subLabel="Dominant device"
          accent="text-amber-400"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visitors Over Time */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5 dark:border-white/5">
            <div>
              <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">Traffic Velocity</h2>
              <p className="text-secondary text-xs">Daily visitor hits over time</p>
            </div>
            <span className="mono-label text-[10px] text-neon-blue">Live Series</span>
          </div>

          <TrafficVelocityChart data={data.visitorsByDay} />
        </div>

        {/* Device Breakdown */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div className="mb-4 pb-4 border-b border-black/5 dark:border-white/5">
            <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">Device Shares</h2>
            <p className="text-secondary text-xs">Platforms accessing the site</p>
          </div>

          <DeviceSharesChart data={data.devices} />
        </div>
      </div>

      {/* Secondary Row: Top Pages & Countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <div className="mb-6 pb-4 border-b border-black/5 dark:border-white/5">
            <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">Most Visited Routes</h2>
            <p className="text-secondary text-xs">Total hit count per URI path</p>
          </div>

          <TopPagesChart data={data.visitorsByPage} />
        </div>

        {/* Top Countries */}
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <div className="mb-6 pb-4 border-b border-black/5 dark:border-white/5">
            <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">Geographic Origins</h2>
            <p className="text-secondary text-xs">Visitor volume by detected nation</p>
          </div>

          <div className="space-y-4">
            {data.countries.slice(0, 5).map((country, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="mono-label text-neon-blue">0{idx + 1}</span>
                  <span className="font-medium text-[var(--text-main)]">
                    {country.name === 'Unknown' ? 'Unknown Origin' : country.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-28 sm:w-40 h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
                      style={{ width: `${Math.min(100, (country.value / Math.max(1, data.totalViews)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-secondary w-10 text-right">{country.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 overflow-hidden">
        <div className="mb-6 pb-4 border-b border-black/5 dark:border-white/5">
          <h2 className="font-display font-semibold text-lg text-[var(--text-main)]">Recent Access Logs</h2>
          <p className="text-secondary text-xs">Raw telemetry sessions from live visitors</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5 text-secondary">
                <th className="py-3 px-2 font-medium">Location</th>
                <th className="py-3 px-2 font-medium">Route</th>
                <th className="py-3 px-2 font-medium">Device / OS</th>
                <th className="py-3 px-2 font-medium">Browser</th>
                <th className="py-3 px-2 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.recentVisitors.slice(0, 10).map((visitor) => (
                <tr
                  key={visitor.id}
                  className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-2 text-[var(--text-main)] font-medium">
                    {visitor.city && visitor.city !== 'Unknown' ? `${visitor.city}, ` : ''}
                    {visitor.country || 'Unknown'}
                  </td>
                  <td className="py-3 px-2 text-neon-blue">{visitor.page}</td>
                  <td className="py-3 px-2 text-secondary">
                    {visitor.deviceType} <span className="opacity-50">• {visitor.os}</span>
                  </td>
                  <td className="py-3 px-2 text-secondary">{visitor.browser}</td>
                  <td className="py-3 px-2 text-secondary">
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

function StatCard({ icon: Icon, value, label, subLabel, accent }: any) {
  return (
    <div className="glass-card p-5 rounded-3xl flex flex-col justify-between group">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center">
          <Icon className={`w-4 h-4 ${accent}`} />
        </div>
      </div>
      <div>
        <p className="font-mono text-2xl sm:text-3xl font-bold text-[var(--text-main)] mb-0.5">
          {value}
        </p>
        <p className="text-[var(--text-main)] text-xs font-medium truncate">{label}</p>
        <p className="text-secondary text-[10px] font-mono mt-0.5">{subLabel}</p>
      </div>
    </div>
  );
}
