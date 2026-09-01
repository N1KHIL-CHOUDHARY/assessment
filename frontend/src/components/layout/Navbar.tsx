'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Brain,
  LayoutDashboard,
  BookOpen,
  LogOut,
  Menu,
  X,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      active: pathname === '/dashboard',
    },
    {
      name: 'Topics',
      href: '/topics',
      icon: <BookOpen className="w-4 h-4" />,
      active: pathname.startsWith('/topics'),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 bg-clip-text text-transparent">
                  Cognibloom
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-500 -mt-1 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 inline" /> AI Learning
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                    link.active
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.username}
                    </span>
                    <span className="text-[11px] text-slate-400 leading-tight truncate max-w-[140px]">
                      {user.email}
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 h-8 gap-1.5"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-medium">Logout</span>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  link.active
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {user && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  {user.username ? user.username.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800">{user.username}</span>
                  <span className="text-[11px] text-slate-400">{user.email}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-rose-600 hover:bg-rose-50 text-xs gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
