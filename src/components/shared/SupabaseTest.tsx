import React, { useEffect, useState } from 'react';
import { testSupabaseSetup } from '../../lib/supabase';

export function SupabaseTest() {
  const [status, setStatus] = useState<'testing' | 'connected' | 'error'>('testing');

  useEffect(() => {
    async function checkConnection() {
      const isConnected = await testSupabaseSetup();
      setStatus(isConnected ? 'connected' : 'error');
    }
    checkConnection();
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-white rounded-lg shadow-lg">
      <p className={`text-sm ${
        status === 'connected' ? 'text-green-600' :
        status === 'error' ? 'text-red-600' :
        'text-blue-600'
      }`}>
        Supabase: {status}
      </p>
    </div>
  );
}