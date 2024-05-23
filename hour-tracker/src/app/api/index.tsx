import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  console.log('Session:', session);
  console.log('Status:', status);

  if (status === 'loading'){
    return <p>Loading...</p>;
  }

  return (
    <div>
      {!session ? (
        <>
          <p>You are not signed in</p>
          <button onClick={() => signIn('google')}>Sign in with Google</button>
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
