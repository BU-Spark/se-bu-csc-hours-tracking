import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './page.module.css';

function Login() {
  
  return (
    <div>
      <h1>Boston University Community Service Time Log</h1>
        <>
          <p>You are not signed in</p>
          <button className={styles.signInButton} onClick={() => signIn()}>
            Sign in
          </button>
        </>
    
    </div>
  )
}

export default Login