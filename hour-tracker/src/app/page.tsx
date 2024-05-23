"use client";

import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './page.module.css';

export default function Home() {
  const { data: session, status } = useSession();

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
          <button className={styles.signInButton} onClick={() => signIn()}>
            Sign in
          </button>
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
