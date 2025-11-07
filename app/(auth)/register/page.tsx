'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Navbar } from '@/components/navbar';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [teacherCode, setTeacherCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, teacherCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Registrasi gagal');
        return;
      }

      toast.success('Registrasi berhasil! Mengalihkan...');
      setTimeout(() => {
        router.push('/beranda');
        router.refresh();
      }, 500);
    } catch {
      toast.error('Terjadi kesalahan koneksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-white pt-16">
        <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">Register</h1>
          <p className="text-gray-600">Buat akun baru untuk bergabung dengan CeritaKita</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Nama
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Role
            </label>
            <Select value={role} onValueChange={(value) => {
              setRole(value);
              if (value !== 'GURU') {
                setTeacherCode('');
              }
            }} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SISWA">Siswa</SelectItem>
                <SelectItem value="GURU">Guru</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === 'GURU' && (
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Kode Guru
              </label>
              <Input
                type="text"
                value={teacherCode}
                onChange={(e) => setTeacherCode(e.target.value)}
                required
                placeholder="Masukkan kode unik guru"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Kode khusus untuk pendaftaran guru
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !role || (role === 'GURU' && !teacherCode)}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-black font-medium hover:underline">
            Login
          </Link>
        </p>
        </div>
      </div>
    </>
  );
}
