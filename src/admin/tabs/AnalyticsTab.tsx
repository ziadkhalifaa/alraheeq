import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/api';
import { Eye, Mail, TrendingUp, PhoneForwarded, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { getSafeValue } from '@/editor/utils';

export default function AnalyticsTab() {
  const { data: statsRes, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => analyticsApi.getOverview().then(res => res.data),
  });

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-32 bg-white rounded-3xl animate-pulse" />
      ))}
    </div>
  );

  const stats = statsRes?.overview || { totalViews: 0, totalInquiries: 0, conversionRate: 0 };
  const mostViewed = (statsRes?.mostViewed || []).map((p: any) => ({
    ...p,
    name: getSafeValue(p.name, 'en') || 'Unknown Product',
    views: Number(p.views)
  }));
  const sources = (statsRes?.sources || []).map((s: any) => ({
    ...s,
    source: getSafeValue(s.source, 'en'),
    count: Number(s.count)
  }));

  return (
    <div className="space-y-8 pb-20">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Page Views', value: stats.totalViews, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Business Inquiries', value: stats.totalInquiries, icon: Mail, color: 'text-brand-green', bg: 'bg-green-50' },
          { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: TrendingUp, color: 'text-brand-gold', bg: 'bg-amber-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
            <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center`}>
              <s.icon className={s.color} size={24} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">{s.label}</div>
              <div className="text-3xl font-bold text-gray-900">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Viewed Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Product Views</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostViewed}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="views" fill="#1B4332" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Inquiry Sources</h3>
          <div className="h-80 w-full flex items-center justify-center">
            {sources.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sources}
                    dataKey="count"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {sources.map((_:any, index:number) => (
                      <Cell key={`cell-${index}`} fill={['#1B4332', '#C5A059', '#2D6A4F'][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-400">No source data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Events Log */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Live Interaction Feed</h3>
          <span className="flex items-center gap-2 text-xs font-bold text-brand-green animate-pulse">
            <span className="w-2 h-2 rounded-full bg-brand-green" /> LIVE
          </span>
        </div>
        <div className="divide-y divide-gray-50 max-h-[400px] overflow-auto">
          {statsRes?.recentEvents?.filter((e:any) => e && e.type).map((event: any) => (
            <div key={event.id} className="px-8 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  event.type?.includes('click') ? 'bg-amber-50 text-brand-gold' : 
                  event.type?.includes('inquiry') ? 'bg-green-50 text-brand-green' : 'bg-blue-50 text-blue-600'
                }`}>
                  {event.type?.includes('whatsapp') ? <PhoneForwarded size={18} /> : 
                   event.type?.includes('quote') ? <Mail size={18} /> : <Eye size={18} />}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 capitalize">
                    {getSafeValue(event.type, 'en')?.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getSafeValue(event.product_name, 'en') || 'General Page'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-gray-400">
                  {new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-[10px] text-gray-300 font-mono">{event.ip_address}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
