'use client';

import { useState } from 'react';
import { Bell, Settings, LogOut, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    // Dispatch event to sidebar
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('toggleSidebar');
      window.dispatchEvent(event);
    }
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
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between lg:justify-end gap-4 z-30">
      {/* Hamburger Menu for Mobile */}
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-100 rounded-lg transition lg:hidden"
      >
        <Menu size={24} className="text-gray-700" />
      </button>

      {/* Logo for Mobile */}
      <h1 className="text-xl font-bold text-black lg:hidden">CeritaKita</h1>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
          <Bell size={20} className="text-gray-700" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition">
              <Avatar className="w-8 h-8 md:w-10 md:h-10">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="bg-black text-white text-xs md:text-sm">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-black">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
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
            <DropdownMenuItem onClick={() => router.push('/pengaturan')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan Akun</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
