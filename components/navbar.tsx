'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white border-b border-gray-200 shadow-sm' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link href="/" className="text-xl md:text-2xl font-bold text-black">
              CeritaKita
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-black hover:text-gray-600 transition font-medium"
            >
              Beranda
            </Link>
            <Link
              href="/tentang"
              className="text-black hover:text-gray-600 transition font-medium"
            >
              Tentang
            </Link>
            <Link
              href="/cerita"
              className="text-black hover:text-gray-600 transition font-medium"
            >
              Cerita
            </Link>
            <Link
              href="/jurnal"
              className="text-black hover:text-gray-600 transition font-medium"
            >
              Jurnal
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback className="bg-black text-white text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-black hidden lg:block">
                      {user.name}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-black">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/beranda')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/pengaturan')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block px-4 py-2 text-black hover:text-gray-600 transition font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 md:px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm"
                >
                  Mulai
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-black hover:bg-gray-100 transition font-medium rounded-lg"
            >
              Beranda
            </Link>
            <Link
              href="/tentang"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-black hover:bg-gray-100 transition font-medium rounded-lg"
            >
              Tentang
            </Link>
            <Link
              href="/cerita"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-black hover:bg-gray-100 transition font-medium rounded-lg"
            >
              Cerita
            </Link>
            <Link
              href="/jurnal"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 text-black hover:bg-gray-100 transition font-medium rounded-lg"
            >
              Jurnal
            </Link>
            {!user && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-black hover:bg-gray-100 transition font-medium rounded-lg sm:hidden"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
