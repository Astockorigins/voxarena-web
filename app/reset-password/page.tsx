'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we have an access token in the URL hash (from the email link)
    const hash = window.location.hash;
    
    if (hash) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      
      if (accessToken && refreshToken) {
        // Set the session so Supabase knows who is resetting the password
        supabase.auth.setSession({ 
          access_token: accessToken, 
          refresh_token: refreshToken 
        }).then(({ error }) => {
          if (error) {
            setMessage("Error: Link is invalid or has expired.");
          } else {
            setIsReady(true);
          }
        });
        return;
      }
    }
    
    // If no hash, check if a session already exists (e.g., user already logged in)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsReady(true);
      } else {
        setMessage("No active session. Please click the link in your email again.");
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else {
      setMessage('Password updated successfully! Redirecting to home...');
      setTimeout(() => router.push('/'), 2500);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-vox-ivory px-6">
      <div className="bg-vox-card p-10 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-vox-charcoal mb-2 text-center">Reset Password</h1>
        <p className="text-vox-grey text-center mb-8">Enter your new password below.</p>
        
        {isReady ? (
          <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="New Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vox-emerald bg-white text-vox-charcoal text-lg"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-vox-emerald text-vox-ivory font-bold py-4 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 text-lg"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        ) : (
          <div className="text-center py-6">
            {message ? (
              <p className="text-red-500 font-medium">{message}</p>
            ) : (
              <p className="text-vox-grey">Verifying your secure link...</p>
            )}
          </div>
        )}

        {message && isReady && (
          <p className={`mt-6 text-center font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </main>
  );
}