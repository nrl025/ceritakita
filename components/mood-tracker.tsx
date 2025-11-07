'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, Frown, Meh, Sparkles, Cloud, Angry } from 'lucide-react';
import { toast } from 'sonner';

const moodOptions = [
  { type: 'SENANG', icon: Smile, label: 'Senang', color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700 border-yellow-300' },
  { type: 'SEDIH', icon: Frown, label: 'Sedih', color: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300' },
  { type: 'STRES', icon: Cloud, label: 'Stres', color: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300' },
  { type: 'TENANG', icon: Sparkles, label: 'Tenang', color: 'bg-green-100 hover:bg-green-200 text-green-700 border-green-300' },
  { type: 'CEMAS', icon: Meh, label: 'Cemas', color: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-300' },
  { type: 'MARAH', icon: Angry, label: 'Marah', color: 'bg-red-100 hover:bg-red-200 text-red-700 border-red-300' },
];

export function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [todayMood, setTodayMood] = useState<any>(null);

  useEffect(() => {
    fetchTodayMood();
  }, []);

  const fetchTodayMood = async () => {
    try {
      const res = await fetch('/api/moods?limit=1');
      if (res.ok) {
        const data = await res.json();
        if (data.moods && data.moods.length > 0) {
          const mood = data.moods[0];
          const today = new Date();
          const moodDate = new Date(mood.createdAt);
          
          // Check if mood is from today
          if (
            moodDate.getDate() === today.getDate() &&
            moodDate.getMonth() === today.getMonth() &&
            moodDate.getFullYear() === today.getFullYear()
          ) {
            setTodayMood(mood);
            setSelectedMood(mood.type);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch mood:', error);
    }
  };

  const handleMoodSelect = async (moodType: string) => {
    if (loading) return;

    setSelectedMood(moodType);
    setLoading(true);

    try {
      const res = await fetch('/api/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: moodType }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal mencatat mood');
        return;
      }

      toast.success(todayMood ? 'Mood hari ini diperbarui!' : 'Mood berhasil dicatat!');
      setTodayMood(data.mood);
    } catch (error) {
      toast.error('Terjadi kesalahan');
      setSelectedMood(todayMood?.type || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-purple-600" size={24} />
          Bagaimana mood Anda hari ini?
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          {todayMood 
            ? 'Anda sudah mencatat mood hari ini. Klik lagi untuk mengubah.'
            : 'Pilih emoticon yang menggambarkan perasaanmu saat ini'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {moodOptions.map(({ type, icon: Icon, label, color }) => {
            const isSelected = selectedMood === type;
            
            return (
              <button
                key={type}
                onClick={() => handleMoodSelect(type)}
                disabled={loading}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? color.replace('hover:', '')
                    : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
              >
                <Icon size={32} className={isSelected ? '' : 'text-gray-500'} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>

        {todayMood && (
          <div className="mt-4 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Mood hari ini:</span>{' '}
              {moodOptions.find(m => m.type === todayMood.type)?.label}
              {todayMood.note && ` - ${todayMood.note}`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
