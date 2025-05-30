'use client';

import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebase';
import { Button, FluentProvider, webLightTheme, makeStyles, shorthands, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('32px'),
    ...shorthands.borderRadius('12px'),
    boxShadow: tokens.shadow28,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
  },
  text: {
    color: tokens.colorNeutralForeground2,
    fontSize: '14px',
  },
});

export default function Home() {
  const styles = useStyles();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Logged in as:', result.user.displayName);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.heading}>Welcome to PersonaNest</h1>
          <p className={styles.text}>
            Sign in to create, customize, and monetize your own AI persona.
          </p>
          <Button appearance="primary" size="large" onClick={handleLogin}>
            Sign in with Google
          </Button>
        </div>
      </div>
    </FluentProvider>
  );
}
