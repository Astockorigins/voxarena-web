'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase puts the access token in the URL hash when the user clicks the email link
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      
      if (accessToken && refreshToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      }
    }
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated successfully! Redirecting to app...');
      setTimeout(() => router.push('/'), 2000);
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-vox-ivory px-6">
      <div className="bg-vox-card p-10 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-vox-charcoal mb-2 text-center">Reset Password</h1>
        <p className="text-vox-grey text-center mb-8">Enter your new password below.</p>
        
        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vox-emerald bg-white text-vox-charcoal"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-vox-emerald text-vox-ivory font-bold py-3 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}