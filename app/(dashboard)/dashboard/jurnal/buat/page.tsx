'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

export default function BuatJurnalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    privacy: 'PRIVATE',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Judul dan konten wajib diisi');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Gagal membuat jurnal');
        return;
      }

      toast.success('Jurnal berhasil dibuat!');
      router.push('/dashboard/jurnal');
      router.refresh();
    } catch (error) {
      toast.error('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center gap-3 md:gap-4">
        <Link
          href="/dashboard/jurnal"
          className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-black">Tulis Jurnal Baru</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Tuangkan pikiran dan perasaanmu hari ini</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Detail Jurnal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Judul */}
            <div className="space-y-2">
              <Label htmlFor="title">Judul Jurnal</Label>
              <Input
                id="title"
                placeholder="Judul jurnal..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Konten */}
            <div className="space-y-2">
              <Label htmlFor="content">Isi Jurnal</Label>
              <Textarea
                id="content"
                placeholder="Tulis refleksi dan perasaanmu di sini..."
                rows={15}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                className="resize-none"
              />
            </div>

            {/* Privacy */}
            <div className="space-y-3">
              <Label>Privasi</Label>
              <RadioGroup
                value={formData.privacy}
                onValueChange={(value) => setFormData({ ...formData, privacy: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PRIVATE" id="private" />
                  <Label htmlFor="private" className="font-normal cursor-pointer">
                    Pribadi - Hanya saya yang bisa melihat
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ANONYMOUS" id="anonymous" />
                  <Label htmlFor="anonymous" className="font-normal cursor-pointer">
                    Anonim - Publik tapi nama saya disembunyikan
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PUBLIC" id="public" />
                  <Label htmlFor="public" className="font-normal cursor-pointer">
                    Publik - Semua orang bisa melihat dengan nama saya
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Link
            href="/dashboard/jurnal"
            className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50"
          >
            <Save size={18} />
            <span>{loading ? 'Menyimpan...' : 'Simpan Jurnal'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
