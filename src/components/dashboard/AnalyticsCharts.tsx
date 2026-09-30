'use client';

import React, { useState, useEffect } from 'react';
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
  Legend,
} from 'recharts';

const COLORS = ['#00f3ff', '#bc13fe', '#fc4778', '#10b981', '#6366f1'];

export function TrafficVelocityChart({ data }: { data: Array<{ date: string; count: number }> }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-72 w-full" />;
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" />
          <XAxis dataKey="date" stroke="currentColor" className="text-secondary text-[11px] font-mono" />
          <YAxis stroke="currentColor" className="text-secondary text-[11px] font-mono" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(10, 14, 30, 0.95)',
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              color: '#fff',
              fontFamily: 'monospace',
              fontSize: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#bc13fe"
            strokeWidth={2.5}
            dot={{ r: 3, fill: '#bc13fe' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DeviceSharesChart({ data }: { data: Array<{ name: string; value: number }> }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 w-full" />;
  }

  // Data-driven styling without the deprecated Cell component
  const coloredData = (data || []).map((entry, index) => ({
    ...entry,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={coloredData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={5}
            dataKey="value"
            nameKey="name"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(10, 14, 30, 0.95)',
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontFamily: 'monospace',
            }}
          />
          <Legend formatter={(value) => <span className="text-xs font-mono text-secondary">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopPagesChart({ data }: { data: Array<{ page: string; count: number }> }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 w-full" />;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.1)" />
          <XAxis type="number" stroke="currentColor" className="text-secondary text-[11px] font-mono" />
          <YAxis type="category" dataKey="page" width={110} stroke="currentColor" className="text-secondary text-[11px] font-mono" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(10, 14, 30, 0.95)',
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontFamily: 'monospace',
            }}
          />
          <Bar dataKey="count" fill="#00f3ff" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
