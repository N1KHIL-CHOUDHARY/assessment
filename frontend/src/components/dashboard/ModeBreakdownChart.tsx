'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { InteractionsByMode, InteractionMode } from '@/types';
import { LEARNING_MODES } from '@/utils/modeConstants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ModeBreakdownChartProps {
  data: InteractionsByMode;
}

const MODE_COLORS: Record<InteractionMode, string> = {
  LEARN: '#6366f1',
  CHALLENGE: '#f59e0b',
  EXPLAIN: '#10b981',
  VALIDATE: '#8b5cf6',
};

export const ModeBreakdownChart: React.FC<ModeBreakdownChartProps> = ({ data }) => {
  const chartData = LEARNING_MODES.map((mode) => ({
    name: mode.label,
    key: mode.key,
    count: data[mode.key] || 0,
    tagline: mode.tagline,
  }));

  const totalInteractions = Object.values(data).reduce((acc, val) => acc + val, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = totalInteractions > 0 ? ((item.count / totalInteractions) * 100).toFixed(1) : '0';
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg text-xs border border-slate-800 space-y-1">
          <p className="font-bold text-slate-100">{item.name} Mode</p>
          <p className="text-slate-400">{item.tagline}</p>
          <p className="text-indigo-300 font-semibold">
            {item.count} interaction{item.count === 1 ? '' : 's'} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle>Interaction Mode Breakdown</CardTitle>
          <CardDescription>
            Distribution of learning queries across the 4 adaptive modes
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="h-48 w-full">
            {totalInteractions === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                <span>No mode interaction data yet</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry) => (
                      <Cell key={entry.key} fill={MODE_COLORS[entry.key as InteractionMode]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 mt-2">
        {chartData.map((item) => (
          <div
            key={item.key}
            className="flex flex-col p-2 rounded-lg bg-slate-50 border border-slate-100 text-left"
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: MODE_COLORS[item.key as InteractionMode] }}
              />
              <span className="text-[11px] font-semibold text-slate-700">{item.name}</span>
            </div>
            <span className="text-sm font-bold text-slate-900">
              {item.count}{' '}
              <span className="text-[10px] font-normal text-slate-400">
                ({totalInteractions > 0 ? Math.round((item.count / totalInteractions) * 100) : 0}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
