'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth-context';

export function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const navGroups = [
    {
      id: 'news',
      links: [
        { href: '/actus', label: 'Actus' },
      ],
    },
    {
      id: 'content',
      links: [
        { href: '/cards', label: 'Cartes' },
        { href: '/legends', label: 'Légendes' },
        { href: '/decks', label: 'Decks' },
      ],
    },
    {
      id: 'tools',
      links: [
        { href: '/deckbuilder', label: 'Deck Builder' },
      ],
    },
    {
      id: 'learn',
      links: [
        { href: '/learn', label: 'Apprendre à jouer' },
      ],
    },
  ];

  return (
    <nav
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0c10]/90 backdrop-blur-xl py-3 border-b border-white/10 shadow-xl'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rift-blue to-rift-purple flex items-center justify-center shadow-[var(--shadow-md)] group-hover:scale-110 transition-transform">
              <span className="text-xl font-black text-white italic">R</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black text-[var(--text-primary)] tracking-tighter leading-none">RIFTBOUND</span>
              <span className="text-[10px] font-bold text-rift-gold tracking-[0.2em] uppercase leading-none mt-0.5">Communauté</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navGroups.map((group, groupIndex) => (
              <div key={group.id} className="flex items-center">
                <div className="flex items-center gap-1">
                  {group.links.map(link => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`relative px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          isActive
                            ? 'text-white bg-rift-blue/15 border-b-2 border-rift-blue'
                            : 'text-gray-400 border-b-2 border-transparent hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {link.label}
                        {isActive && (
                          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rift-blue" />
                        )}
                      </Link>
                    );
                  })}
                </div>
                {groupIndex < navGroups.length - 1 && (
                  <div className="w-px h-6 bg-white/10 mx-3" />
                )}
              </div>
            ))}

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/premium"
                  className="px-5 py-2 bg-gradient-to-r from-rift-blue to-cyan-500 text-white text-sm font-bold rounded-xl hover:shadow-[0_0_20px_rgba(10,200,255,0.4)] transition-all"
                >
                  PREMIUM
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-10 h-10 rounded-xl bg-[var(--border-subtle)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/10 transition-all"
                  title="Déconnexion"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2.5 bg-white text-black font-black text-sm rounded-xl hover:bg-gray-200 transition-all shadow-[var(--shadow-md)]"
              >
                CONNEXION
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden w-10 h-10 rounded-xl bg-[var(--border-subtle)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 p-4 rounded-3xl bg-[var(--surface-0)]/95 border border-[var(--border-default)] backdrop-blur-2xl shadow-[var(--shadow-2xl)] animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-1">
              {navGroups.flatMap(group => group.links).map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-lg font-bold transition-all ${
                    pathname === link.href
                      ? 'text-[var(--text-primary)] bg-[var(--border-subtle)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-[var(--border-subtle)] my-4" />

              {user ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/premium"
                    className="w-full py-4 bg-gradient-to-r from-rift-purple to-pink-600 text-white font-black rounded-2xl text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    PREMIUM
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl text-center"
                  >
                    DÉCONNEXION
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="w-full py-4 bg-white text-black font-black rounded-2xl text-center shadow-[var(--shadow-md)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  CONNEXION
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
