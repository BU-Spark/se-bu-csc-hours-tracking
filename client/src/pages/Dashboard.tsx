import { signOut, useSession } from 'next-auth/react';
import React from 'react'
import { PageProps } from '../common/interfaces';

  const Dashboard: React.FC<PageProps> = ({ session }) => {

    const { data: sesh, status } = useSession();

    let pfp = "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg";
    
    if (status === "authenticated" && sesh?.user?.image) {
        pfp = sesh.user.image;
        console.log("Session object: ", sesh);
    } else {
        console.log("Session object is missing or does not have an image: ", sesh);
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