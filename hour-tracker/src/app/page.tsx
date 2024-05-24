"use client";


import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/login';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { data: session, status } = useSession();

  console.log('Session:', session);
  console.log('Status:', status);

  useEffect( () =>{
    if(status != "authenticated"){
      setIsLoggedIn(true)
    }
    else{
      setIsLoggedIn(false)
    }
  }, [status])


  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    isLoggedIn ? <Login /> : (<Dashboard/> )   
  );
}
