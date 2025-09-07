'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserNav } from '@/components/user-nav';
import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
}

const mainNav: NavItem[] = [
  {
    title: 'Solutions',
    href: '/solutions',
  },
  {
    title: 'News',
    href: '/news',
  },
  {
    title: 'Industries',
    href: '/industries',
  },
  {
    title: 'Developers',
    href: '/resources',
  },
];

interface SiteHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  className?: string;
}

export function SiteHeader({ user, className }: SiteHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
    className={cn(
      'sticky top-0 z-50 w-full transition-all duration-300',
      isDashboard 
        ? 'bg-background/95 backdrop-blur-md border-b' 
        : scrolled 
          ? 'bg-black/90 backdrop-blur-md border-b border-gray-800' 
          : 'bg-transparent',
      className
    )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo iconOnly className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold text-white">Imhotep</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  'text-gray-300 hover:text-white hover:bg-gray-800/50',
                  pathname === item.href ? 'text-white' : 'text-gray-400',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
                {...(item.disabled && { 'aria-disabled': true })}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            {/* Theme toggle removed */}
            {user ? (
              <UserNav user={user} />
            ) : (
              <>
                <Button 
                  asChild
                  variant="ghost" 
                  className="hidden md:flex text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button 
                  asChild
                  className="hidden md:flex bg-green-500 hover:bg-green-600 text-black"
                >
                  <Link href="/signup">
                    Sign Up
                    <Icons.chevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn(
        'md:hidden transition-all duration-300 ease-in-out overflow-hidden',
        mobileMenuOpen ? 'max-h-screen' : 'max-h-0'
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.title}
            </Link>
          ))}
          {!user && (
            <div className="text-center pt-4">
              <Button asChild className="w-full mb-2 bg-green-500 hover:bg-green-600 text-black">
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full text-white border-gray-600 hover:bg-gray-800">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
