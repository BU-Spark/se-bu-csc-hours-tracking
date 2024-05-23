"use client";

import { signIn, signOut, useSession, getProviders, ClientSafeProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    }) ();
  }, []);

  console.log('Session:', session);
  console.log('Status:', status);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Boston University Community Service Time Log</h1>
      {!session ? (
        <>
          <p>You are not signed in</p>
          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <button className={styles.signInButton} onClick={() => signIn(provider.id)}>
                  <img src="/google-logo.png" alt="Google Logo" width={20} height={20}/>
                  Sign in with {provider.name}
                </button>
            </div>
          ))}
          </>
      ) : (
        <>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  );
}
