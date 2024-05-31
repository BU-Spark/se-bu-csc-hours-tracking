import { signOut, useSession } from 'next-auth/react';
import React from 'react'

  const Dashboard: React.FC = () => {

    const { data: session, status } = useSession();

    let pfp = "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg";
    
    if (status === "authenticated" && session?.user?.image) {
        pfp = session.user.image;
        console.log("Session object: ", session);
    } else {
        console.log("Session object is missing or does not have an image: ", session);
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