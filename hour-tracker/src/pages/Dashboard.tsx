import { signOut, useSession } from 'next-auth/react';
import React from 'react'

function Dashboard() {
    const { data: session, status } = useSession();

    let pfp = "https://via.placeholder.com/150";
    if(session?.user?.image){
         pfp = session.user.image
    }
    
  return (
    <div><h1>Welcome to your dashboard</h1>
    <div>
        <img src= {pfp} alt = "pfp"></img>
        <h2>{session?.user.name}</h2>
    </div>
    
    <button onClick={() => signOut()}>Sign out</button></div>
  )
}

export default Dashboard