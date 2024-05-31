import { signOut} from 'next-auth/react';
import React from 'react'

  const Dashboard: React.FC = () => {

    
  return (
    <div>
    <button onClick={() => signOut()}>Sign out</button></div>
  )
}

export default Dashboard