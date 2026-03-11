'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth-context';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      window.location.href = '/premium';
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-rift-gold">
            Riftbound Guide
          </Link>
          <p className="text-gray-400 mt-2">Connexion à ton compte</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-rift-dark-secondary p-8 rounded-2xl border border-gray-800">
          {error && (
            <div className="bg-rift-red/20 border border-rift-red text-rift-red p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-rift-dark border border-gray-700 rounded-lg text-white focus:border-rift-blue focus:outline-none"
              placeholder="ton@email.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-rift-dark border border-gray-700 rounded-lg text-white focus:border-rift-blue focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-rift-blue text-rift-dark font-bold rounded-lg hover:bg-rift-blue/80 transition-colors disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-rift-blue hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
