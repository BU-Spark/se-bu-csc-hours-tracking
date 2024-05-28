"use client";


import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import CustomHeader from '@/components/CustomHeader';
import CustomSider from '@/components/CustomSider'
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { data: session, status } = useSession();

  // console.log('Session:', session);
  // console.log('Status:', status);

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
    <>
      <Layout>
        <CustomHeader session={session}/>
      </Layout>
      <Layout hasSider >
        <CustomSider session={session}/>
      </Layout>
      <Content style={{marginLeft: 200}}>
        {isLoggedIn ? <Login /> : (<Dashboard session={session}/> )   }
      </Content>
    </>
    
      
      
    
   
      
    
  );
}
