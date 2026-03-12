'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth-context';
import { Button } from './ui/Button';

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
      id: 'learn',
      label: 'APPRENDRE',
      links: [
        { href: '/learn', label: 'Apprendre à jouer' },
      ],
    },
    {
      id: 'news',
      label: 'COMMUNAUTÉ',
      links: [
        { href: '/actus', label: 'Actus' },
      ],
    },
    {
      id: 'content',
      label: 'CONTENU',
      links: [
        { href: '/cards', label: 'Cartes' },
        { href: '/legends', label: 'Légendes' },
        { href: '/decks', label: 'Decks' },
      ],
    },
    {
      id: 'tools',
      label: 'OUTILS',
      links: [
        { href: '/deckbuilder', label: 'Deck Builder' },
      ],
    },
  ];

  return (
    <nav
      aria-label="Navigation principale"
      className={`sticky top-0 z-[100] transition-all duration-300 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-2xl py-3 border-b border-white/10 shadow-2xl'
          : 'bg-black/90 backdrop-blur-md py-4 border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rift-blue via-rift-purple to-rift-blue bg-size-200 animate-gradient flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] transition-all duration-300 group-hover:scale-105">
              <span className="text-2xl font-black text-white italic drop-shadow-lg">R</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tighter leading-none group-hover:text-rift-blue transition-colors duration-300">RIFTBOUND</span>
              <span className="text-[10px] font-bold text-rift-gold tracking-[0.25em] uppercase leading-none mt-0.5">Communauté</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navGroups.map((group, groupIndex) => (
              <div key={group.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  {group.label && (
                    <span className="text-[9px] font-bold text-gray-400 tracking-[0.15em] uppercase px-2">{group.label}</span>
                  )}
                  <div className="flex items-center gap-1">
                    {group.links.map(link => {
                      const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`relative px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 group ${
                            isActive
                              ? 'text-white'
                              : 'text-gray-300 hover:text-white'
                          }`}
                        >
                          <span className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                            {link.label}
                          </span>
                          {isActive ? (
                            <span className="absolute inset-0 bg-gradient-to-r from-rift-blue/25 to-rift-purple/25 rounded-xl border border-rift-blue/40 shadow-[0_0_15px_rgba(10,200,255,0.2)]" />
                          ) : (
                            <span className="absolute inset-0 bg-white/8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          )}
                          {isActive && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-rift-blue shadow-[0_0_10px_rgba(10,200,255,0.9)]" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
                {groupIndex < navGroups.length - 1 && (
                  <div className="w-px h-10 bg-gradient-to-b from-white/15 via-white/5 to-transparent mx-4" />
                )}
              </div>
            ))}

            {user ? (
              <div className="flex items-center gap-4 ml-4">
                <Link
                  href="/premium"
                  className="px-6 py-3 bg-gradient-to-r from-rift-blue to-cyan-500 text-white text-sm font-bold rounded-xl hover:shadow-[0_0_30px_rgba(10,200,255,0.6)] transition-all hover:scale-105"
                >
                  PREMIUM
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/30 transition-all"
                  title="Déconnexion"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Button
                href="/login"
                variant="secondary"
                size="sm"
                className="ml-4"
              >
                CONNEXION
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-rift-blue/50 hover:bg-white/10 transition-all"
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
          <div className="lg:hidden absolute top-full left-0 right-0 mt-3 mx-4 p-5 rounded-3xl bg-black/98 border border-white/10 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-2">
              {navGroups.map((group) => (
                <div key={group.id}>
                  {group.label && (
                    <span className="text-[10px] font-bold text-gray-500 tracking-[0.15em] uppercase px-3 py-2 block">{group.label}</span>
                  )}
                  <div className="flex flex-col gap-1">
                    {group.links.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`px-4 py-4 rounded-xl text-base font-bold transition-all duration-300 ${
                          pathname === link.href
                            ? 'text-white bg-gradient-to-r from-rift-blue/25 to-rift-purple/25 border border-rift-blue/40'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="h-px bg-white/10 my-4" />

              {user ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/premium"
                    className="w-full py-4 bg-gradient-to-r from-rift-purple to-pink-600 text-white font-black rounded-2xl text-center hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    PREMIUM
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl text-center hover:bg-red-500/20 transition-all"
                  >
                    DÉCONNEXION
                  </button>
                </div>
              ) : (
                <Button
                  href="/login"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  CONNEXION
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
