import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DailyCount {
  date: string;
  count: number;
}

export function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [eventsData, setEventsData] = useState<DailyCount[]>([]);

  useEffect(() => {
    async function fetchMetrics() {
      // Total users count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      setTotalUsers(userCount || 0);

      // Active users in last 24h
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: activeCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gt('last_active', oneDayAgo);
      setActiveUsers(activeCount || 0);

      // Events per day (last 7 days)
      const start = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
      start.setHours(0, 0, 0, 0);
      const { data: events } = await supabase
        .from('analytics_events')
        .select('created_at');
      if (events) {
        const counts: Record<string, number> = {};
        for (let i = 0; i < 7; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          counts[d.toISOString().slice(0, 10)] = 0;
        }
        events.forEach((e) => {
          const key = e.created_at.slice(0, 10);
          if (key in counts) counts[key]++;
        });
        setEventsData(
          Object.entries(counts).map(([date, count]) => ({ date, count }))
        );
      }
    }
    fetchMetrics();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 shadow rounded">
          <h2>Total Users</h2>
          <p className="text-3xl">{totalUsers}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2>Active (24h)</h2>
          <p className="text-3xl">{activeUsers}</p>
        </div>
      </div>
      <div className="bg-white p-4 shadow rounded">
        <h2 className="mb-2">Events (Last 7 days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={eventsData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3182CE" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
