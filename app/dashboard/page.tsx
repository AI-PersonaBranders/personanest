'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>🎉 Welcome to your Dashboard</h1>
      <p>This is where your PersonaNest experience begins.</p>
    </main>
  );
}
