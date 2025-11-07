'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, BookMarked, Smile, X } from 'lucide-react';

interface SidebarProps {
  userRole: 'SISWA' | 'GURU';
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const siswaMenu = [
    { icon: Home, label: 'Beranda', href: '/beranda' },
    { icon: BookOpen, label: 'Cerita Saya', href: '/dashboard/cerita' },
    { icon: Smile, label: 'Riwayat Mood', href: '/dashboard/mood' },
  ];

  const guruMenu = [
    { icon: Home, label: 'Beranda', href: '/beranda' },
    { icon: BookOpen, label: 'Kelola Cerita', href: '/dashboard/cerita' },
    { icon: BookMarked, label: 'Kelola Jurnal', href: '/dashboard/jurnal' },
    { icon: Smile, label: 'Riwayat Mood', href: '/dashboard/mood' },
  ];

  const menu = userRole === 'GURU' ? guruMenu : siswaMenu;

  // Listen for toggle events from header
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('toggleSidebar', handleToggle);
    return () => window.removeEventListener('toggleSidebar', handleToggle);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 h-full w-64 bg-white border-r border-gray-200 p-6 z-50 transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <X size={20} />
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-black">CeritaKita</h1>
        </div>

        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
