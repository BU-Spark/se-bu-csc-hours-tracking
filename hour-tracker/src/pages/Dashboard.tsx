import { signOut } from 'next-auth/react';
import React from 'react'
import { Session } from 'next-auth';


interface DashboardProps {
    session: Session | null;
  }

  const Dashboard: React.FC<DashboardProps> = ({ session }) => {

    let pfp = "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg";
    if(session?.user?.image){
         pfp = session.user.image
    }
    
  return (
    <div><h1>Welcome to your dashboard</h1>
    <div>
        <img src= {pfp} alt = "pfp"></img>
        <h2>{session?.user?.name}</h2>
    </div>
    
    <button onClick={() => signOut()}>Sign out</button></div>
  )
}

export default Dashboard