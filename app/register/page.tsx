'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/auth-context';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-rift-dark-secondary p-8 rounded-2xl border border-gray-800">
            <div className="w-16 h-16 mx-auto mb-4 bg-rift-green/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-rift-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Compte créé !</h2>
            <p className="text-gray-400 mb-6">
              Vérifie ton email pour confirmer ton compte.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-rift-blue text-rift-dark font-bold rounded-lg hover:bg-rift-blue/80 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-rift-gold">
            Riftbound Guide
          </Link>
          <p className="text-gray-400 mt-2">Crée ton compte</p>
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

          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-rift-dark border border-gray-700 rounded-lg text-white focus:border-rift-blue focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Inscription...' : 'Créer un compte'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-rift-blue hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
