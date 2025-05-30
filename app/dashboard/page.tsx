'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../firebase';
import {
  createPersona,
  getPersonas,
} from '../../lib/firestore';          // <-- relative path to your lib
import {
  FluentProvider,
  webLightTheme,
  Button,
  Avatar,
  makeStyles,
  tokens,
  TextField,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogActions,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground3,
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: tokens.colorNeutralBackground1,
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: tokens.shadow28,
    width: '100%',
    maxWidth: '600px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  avatar: { marginRight: '1rem' },
  personaList: {
    marginTop: '2rem',
  },
  personaItem: {
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '8px',
  },
});

export default function Dashboard() {
  const styles = useStyles();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [personas, setPersonas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Auth & load personas
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) return router.push('/');
      setUser(u);
      getPersonas(u.uid).then((list) => {
        setPersonas(list);
        setLoading(false);
      });
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const openForm = () => setDialogOpen(true);
  const closeForm = () => {
    setName('');
    setDescription('');
    setDialogOpen(false);
  };

  const handleCreate = async () => {
    if (!user) return;
    await createPersona(user.uid, name, description);
    // reload
    const updated = await getPersonas(user.uid);
    setPersonas(updated);
    closeForm();
  };

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={styles.container}>
        <div className={styles.card}>
          {/* Header */}
          {user && (
            <div className={styles.header}>
              <Avatar
                name={user.displayName || ''}
                image={{ src: user.photoURL || undefined }}
                size={56}
                className={styles.avatar}
              />
              <div>
                <h2>{user.displayName}</h2>
                <p>{user.email}</p>
              </div>
              <Button
                appearance="outline"
                onClick={handleLogout}
                style={{ marginLeft: 'auto' }}
              >
                Log out
              </Button>
            </div>
          )}

          {/* Personas */}
          <div>
            <h3>Your Personas</h3>
            <Button appearance="primary" onClick={openForm}>
              + New Persona
            </Button>

            {loading ? (
              <p>Loading…</p>
            ) : personas.length ? (
              <div className={styles.personaList}>
                {personas.map((p) => (
                  <div key={p.id} className={styles.personaItem}>
                    <strong>{p.name}</strong>
                    <p>{p.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No personas yet.</p>
            )}
          </div>
        </div>

        {/* New Persona Dialog */}
        <Dialog open={dialogOpen} onOpenChange={(_, open) => setDialogOpen(open)}>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Create New Persona</DialogTitle>
              <TextField
                label="Name"
                value={name}
                onChange={(_, data) => setName(data.value)}
                style={{ marginBottom: '1rem' }}
              />
              <TextField
                label="Description"
                value={description}
                onChange={(_, data) => setDescription(data.value)}
                multiline
                rows={3}
              />
              <DialogActions>
                <Button appearance="secondary" onClick={closeForm}>
                  Cancel
                </Button>
                <Button
                  appearance="primary"
                  disabled={!name.trim() || !description.trim()}
                  onClick={handleCreate}
                >
                  Create
                </Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </div>
    </FluentProvider>
  );
}
