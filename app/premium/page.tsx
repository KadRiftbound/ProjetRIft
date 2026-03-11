'use client';

import Link from 'next/link';
import { useAuth } from '../lib/auth-context';

export default function PremiumPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rift-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Premium</h1>
          <p className="text-gray-400">
            {user ? 'Accède à des guides exclusifs et domines la méta' : 'Connecte-toi pour accéder aux guides premium'}
          </p>
        </div>

        {!user ? (
          <div className="bg-rift-dark-secondary rounded-2xl p-12 border border-gray-800 text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-rift-gold/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-rift-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Contenu premium réservé aux membres</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Connecte-toi ou crée un compte pour accéder aux guides détaillés, analyses de méta et bien plus encore.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="px-6 py-3 bg-rift-blue text-rift-dark font-bold rounded-lg hover:bg-rift-blue/80 transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 border border-rift-gold text-rift-gold font-bold rounded-lg hover:bg-rift-gold/10 transition-colors"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-rift-dark-secondary rounded-2xl p-8 border border-rift-gold mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-rift-gold/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-rift-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Bienvenue, {user.email}</h2>
                <p className="text-gray-400 text-sm">Compte gratuit</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Souscrive à un abonnement pour débloquer tous les guides premium.
            </p>
          </div>
        )}
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Single Legend */}
          <div className="bg-rift-dark-secondary rounded-2xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-2">Légende</h2>
            <p className="text-gray-400 mb-4">Guide détaillé pour une légende</p>
            <div className="text-4xl font-bold mb-6">
              2,99€<span className="text-lg font-normal text-gray-400">/légende</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rift-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Guide complet de la légende
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rift-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Matchups détaillés
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rift-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Tips et tricks avancés
              </li>
            </ul>
            <button className="w-full py-3 border-2 border-rift-gold text-rift-gold font-bold rounded-lg hover:bg-rift-gold/10 transition-colors">
              {user ? 'Choisir une légende' : 'Se connecter pour acheter'}
            </button>
          </div>
          
          {/* All Legends */}
          <div className="bg-gradient-to-b from-rift-purple/20 to-rift-dark-secondary rounded-2xl p-8 border border-rift-purple relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-rift-purple text-white text-sm font-semibold rounded-full">
              Populaire
            </div>
            <h2 className="text-2xl font-bold mb-2">Tous les guides</h2>
            <p className="text-gray-400 mb-4">Accès complet à tous les guides</p>
            <div className="text-4xl font-bold mb-6">
              9,99€<span className="text-lg font-normal text-gray-400">/mois</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rift-purple" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Tous les guides de légendes
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rift-purple" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Tier List mise à jour
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rift-purple" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Analyses de méta hebdomadaires
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rift-purple" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Accès prioritaire aux nouveaux guides
              </li>
            </ul>
            <button className="w-full py-3 bg-rift-purple text-white font-bold rounded-lg hover:bg-rift-purple/80 transition-colors">
              {user ? 'S\'abonner' : 'Se connecter pour abonner'}
            </button>
          </div>
        </div>
        
        {/* Coming Soon Notice */}
        <div className="text-center text-gray-500">
          <p>💳 Paiements sécurisés via Stripe</p>
          <p className="text-sm mt-2">Module de paiement en cours de développement</p>
        </div>
      </div>
    </div>
  );
}
