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
} from '../../lib/firestore';
import {
  FluentProvider,
  webLightTheme,
  Button,
  Avatar,
  makeStyles,
  tokens,
  Input,
  Textarea,
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
  const [systemPrompt, setSystemPrompt] = useState(''); // ← New state

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
    setSystemPrompt('');    // ← Reset prompt too
    setDialogOpen(false);
  };

  // ← Updated handleCreate
  const handleCreate = async () => {
    if (!user) return;
    await createPersona(
      user.uid,
      name.trim(),
      description.trim(),
      systemPrompt.trim()   // ← Pass prompt
    );
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
        <Dialog
          open={dialogOpen}
          onOpenChange={(_event, data) => setDialogOpen(data.open)}
        >
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Create New Persona</DialogTitle>

              {/* Name Field */}
              <Input
                placeholder="Name"
                value={name}
                onChange={(_, data) => setName(data.value)}
                style={{ marginBottom: '1rem' }}
              />

              {/* Description Field */}
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(_, data) => setDescription(data.value)}
                style={{ marginBottom: '1rem' }}
              />

              {/* System Prompt Field */}
              <Textarea
                placeholder="System Prompt (how the AI should behave)"
                value={systemPrompt}
                onChange={(_, data) => setSystemPrompt(data.value)}
                style={{ marginBottom: '1rem' }}
              />

              <DialogActions>
                <Button appearance="secondary" onClick={closeForm}>
                  Cancel
                </Button>
                <Button
                  appearance="primary"
                  disabled={
                    !name.trim() ||
                    !description.trim() ||
                    !systemPrompt.trim()  // ← include prompt
                  }
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
