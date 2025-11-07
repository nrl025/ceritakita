'use client';

import { useState } from 'react';
import { Heart, Smile, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Reaction {
  id: string;
  type: string;
  userId: string;
}

interface ReactionButtonsProps {
  storyId: string;
  reactions: Reaction[];
  currentUserId?: string;
}

export function ReactionButtons({ storyId, reactions, currentUserId }: ReactionButtonsProps) {
  const [localReactions, setLocalReactions] = useState<Reaction[]>(reactions);
  const router = useRouter();

  const reactionTypes = [
    { type: 'PELUK', icon: Heart, label: 'Peluk Virtual' },
    { type: 'MENGERTI', icon: Smile, label: 'Aku Mengerti' },
    { type: 'SEMANGAT', icon: Sparkles, label: 'Semangat' },
  ];

  const handleReaction = async (type: string) => {
    if (!currentUserId) {
      toast.error('Silakan login terlebih dahulu untuk memberikan reaksi');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    try {
      // Cek apakah user sudah punya reaksi
      const userCurrentReaction = localReactions.find((r) => r.userId === currentUserId);
      
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, type }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal memberikan reaksi');
        return;
      }

      // Update local state - hapus reaksi lama user, tambah yang baru
      if (userCurrentReaction) {
        if (userCurrentReaction.type === type) {
          // Jika klik reaksi yang sama, hapus reaksi
          setLocalReactions(localReactions.filter((r) => r.id !== userCurrentReaction.id));
          toast.success('Reaksi dihapus');
        } else {
          // Jika klik reaksi berbeda, ganti reaksi
          setLocalReactions([
            ...localReactions.filter((r) => r.userId !== currentUserId),
            { id: Date.now().toString(), type, userId: currentUserId }
          ]);
          toast.success('Reaksi diubah');
        }
      } else {
        // Jika belum ada reaksi, tambah reaksi baru
        setLocalReactions([...localReactions, { id: Date.now().toString(), type, userId: currentUserId }]);
        toast.success('Reaksi diberikan');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan');
    }
  };

  const getReactionCount = (type: string) => {
    return localReactions.filter((r) => r.type === type).length;
  };

  const hasUserReacted = (type: string) => {
    return localReactions.some((r) => r.userId === currentUserId && r.type === type);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {reactionTypes.map(({ type, icon: Icon, label }) => {
        const count = getReactionCount(type);
        const isActive = hasUserReacted(type);

        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition font-medium ${
              isActive
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Icon 
              size={18} 
              className={isActive ? 'text-pink-500' : 'text-gray-600'} 
              fill={isActive ? 'currentColor' : 'none'}
            />
            <span className={`text-sm ${isActive ? 'text-pink-600' : 'text-gray-700'}`}>
              {label}
            </span>
            {count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                isActive ? 'bg-pink-200 text-pink-700' : 'bg-gray-200 text-gray-700'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
