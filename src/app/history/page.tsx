'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login'); // redirect if not logged in
      } else {
        setUser(data.session.user);
      }
    });
  }, [router]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>History</h1>
      {/* Your history page content here */}
    </div>
  );
}