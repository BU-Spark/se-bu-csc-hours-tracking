import { signOut} from 'next-auth/react';
import React from 'react'

  const Dashboard: React.FC = () => {

    
  return (
    <div><h1>Welcome to your dashboard</h1>
    <button onClick={() => signOut()}>Sign out</button></div>
  )
}

export default Dashboard