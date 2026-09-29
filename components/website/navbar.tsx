'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { StrataLogo } from '@/components/ui/brand-logo';

const navLinks = [
  { name: 'Platform', href: '#features' },
  { name: 'Showcase', href: '#showcase' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'Customers', href: '#testimonials' },
  { name: 'FAQ', href: '#faq' },
];

export function WebsiteNavbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-xs py-3' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Strata Brand Logo */}
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <StrataLogo />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeToggle />
            
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium text-sm">
                Log in
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button size="sm" className="font-medium text-sm gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Launch App
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-b border-border bg-background/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  Log in
                </Button>
              </Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Launch App
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
