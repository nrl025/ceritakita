'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smile, 
  Frown, 
  Zap, 
  Wind, 
  CloudRain, 
  Flame,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface MoodStats {
  SENANG: number;
  SEDIH: number;
  STRES: number;
  TENANG: number;
  CEMAS: number;
  MARAH: number;
}

interface MoodData {
  today: MoodStats;
  last7Days: MoodStats;
  last30Days: MoodStats;
  allTime: MoodStats;
  stats: {
    totalStudents: number;
    studentsLoggedToday: number;
    participationRate: number;
  };
}

type PeriodKey = 'today' | 'last7Days' | 'last30Days' | 'allTime';

const moodConfig = {
  SENANG: { 
    icon: Smile, 
    emoji: '😊',
    label: 'Senang', 
    color: 'text-yellow-700', 
    bg: 'bg-yellow-100',
    bgDark: 'bg-yellow-500',
    border: 'border-yellow-300'
  },
  SEDIH: { 
    icon: Frown, 
    emoji: '😢',
    label: 'Sedih', 
    color: 'text-blue-700', 
    bg: 'bg-blue-100',
    bgDark: 'bg-blue-500',
    border: 'border-blue-300'
  },
  STRES: { 
    icon: Zap, 
    emoji: '😰',
    label: 'Stres', 
    color: 'text-red-700', 
    bg: 'bg-red-100',
    bgDark: 'bg-red-500',
    border: 'border-red-300'
  },
  TENANG: { 
    icon: Wind, 
    emoji: '😌',
    label: 'Tenang', 
    color: 'text-green-700', 
    bg: 'bg-green-100',
    bgDark: 'bg-green-500',
    border: 'border-green-300'
  },
  CEMAS: { 
    icon: CloudRain, 
    emoji: '😰',
    label: 'Cemas', 
    color: 'text-purple-700', 
    bg: 'bg-purple-100',
    bgDark: 'bg-purple-500',
    border: 'border-purple-300'
  },
  MARAH: { 
    icon: Flame, 
    emoji: '😠',
    label: 'Marah', 
    color: 'text-orange-700', 
    bg: 'bg-orange-100',
    bgDark: 'bg-orange-500',
    border: 'border-orange-300'
  },
};

const periodLabels = {
  today: 'Hari Ini',
  last7Days: '7 Hari Terakhir',
  last30Days: '30 Hari Terakhir',
  allTime: 'Sepanjang Waktu',
};

export function MoodDashboard() {
  const [data, setData] = useState<MoodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>('last7Days');

  useEffect(() => {
    fetchMoodStats();
  }, []);

  const fetchMoodStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/moods/stats');
      
      if (!res.ok) {
        throw new Error('Gagal mengambil data statistik mood');
      }

      const result = await res.json();
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const currentStats = data[selectedPeriod];
  const total = Object.values(currentStats).reduce((sum, val) => sum + val, 0);
  
  // Sort moods by count
  const sortedMoods = Object.entries(currentStats)
    .sort(([, a], [, b]) => b - a)
    .filter(([, count]) => count > 0);

  const topMood = sortedMoods[0];
  const needsAttention = ['SEDIH', 'STRES', 'CEMAS', 'MARAH'];
  const negativeCount = sortedMoods
    .filter(([mood]) => needsAttention.includes(mood))
    .reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-blue-900 mb-1">{data.stats.studentsLoggedToday}</p>
            <p className="text-sm text-blue-700">Siswa Catat Mood Hari Ini</p>
            <p className="text-xs text-blue-600 mt-1">dari {data.stats.totalStudents} total siswa</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Smile className="text-white" size={24} />
              </div>
              {topMood && <span className="text-3xl">{moodConfig[topMood[0] as keyof MoodStats].emoji}</span>}
            </div>
            <p className="text-3xl font-bold text-purple-900 mb-1">{topMood ? topMood[1] : 0}</p>
            <p className="text-sm text-purple-700">Mood Paling Banyak</p>
            <p className="text-xs text-purple-600 mt-1">
              {topMood ? moodConfig[topMood[0] as keyof MoodStats].label : 'Belum ada data'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <AlertCircle className="text-white" size={24} />
              </div>
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-3xl font-bold text-amber-900 mb-1">{negativeCount}</p>
            <p className="text-sm text-amber-700">Mood Perlu Perhatian</p>
            <p className="text-xs text-amber-600 mt-1">Sedih, Stres, Cemas, Marah</p>
          </CardContent>
        </Card>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(periodLabels) as PeriodKey[]).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              selectedPeriod === period
                ? 'bg-black text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {periodLabels[period]}
          </button>
        ))}
      </div>

      {/* Mood Grid */}
      {total === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Smile size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg font-medium mb-2">Belum ada data mood</p>
            <p className="text-sm text-gray-500">untuk periode {periodLabels[selectedPeriod].toLowerCase()}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(moodConfig).map(([mood, config]) => {
            const count = currentStats[mood as keyof MoodStats];
            const Icon = config.icon;
            const isNegative = needsAttention.includes(mood);
            
            return (
              <Card 
                key={mood} 
                className={`border-2 ${config.border} ${config.bg} hover:shadow-xl transition-all ${
                  count > 0 ? 'scale-100' : 'opacity-60 scale-95'
                }`}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 ${config.bgDark} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <div className="mb-2">
                    <p className={`text-4xl font-bold ${config.color} mb-1`}>{count}</p>
                    <p className={`text-sm font-semibold ${config.color}`}>{config.label}</p>
                  </div>
                  {count > 0 && isNegative && (
                    <Badge variant="destructive" className="text-xs">
                      Perlu perhatian
                    </Badge>
                  )}
                  {count > 0 && !isNegative && (
                    <Badge variant="secondary" className="text-xs">
                      {count} siswa
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Total Summary */}
      {total > 0 && (
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Catatan Mood</p>
                  <p className="text-2xl font-bold text-black">{total} entri</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Periode</p>
                <p className="text-lg font-semibold text-black">{periodLabels[selectedPeriod]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
