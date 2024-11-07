'use client';

import './page.css';
import Dashboard from './(user)/user/dashboard/page';
import Login from './login/page';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import icon from '../../public/photos/full_logo.png';
import CustomSider from '@/components/Sider/CustomSider';
import CustomHeader from '@/components/Header/CustomHeader';
import { Content } from 'antd/es/layout/layout';
import Layout from 'antd/es/layout/layout';

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center ',
          height: '100vh',
        }}
      >
        <Image src={icon} alt="icon" width={500} height={100} className="loading-image" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Login />;
  }

  return (
    <>
      <Layout>
        <CustomHeader />
      </Layout>
      <Layout hasSider>
        <CustomSider />
      </Layout>
      <Content style={{ marginLeft: '15rem' }}>
        <Dashboard />
      </Content>
    </>
  );
}