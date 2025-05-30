'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../firebase';
import {
  FluentProvider,
  webLightTheme,
  Button,
  Avatar,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground3,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
  },
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: tokens.shadow28,
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
  },
  avatar: {
    marginBottom: '1rem',
  },
  email: {
    color: tokens.colorNeutralForeground2,
    marginBottom: '1rem',
  },
});

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const styles = useStyles();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      } else {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <div className={styles.card}>
          {user && (
            <>
              <Avatar
                name={user.displayName || ''}
                image={{ src: user.photoURL || undefined }}
                size={56}
                className={styles.avatar}
              />
              <h2>{user.displayName}</h2>
              <p className={styles.email}>{user.email}</p>
              <Button appearance="secondary" onClick={handleLogout}>
                Log out
              </Button>
            </>
          )}
        </div>
      </div>
    </FluentProvider>
  );
}
