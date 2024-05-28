import React from 'react';
import { Layout, Menu, theme } from 'antd';
import Image from 'next/image';
import icon from '../../public/full_logo.png'
import { PageProps } from '@/common/interfaces';

const { Header, Content, Footer, Sider } = Layout;

const CustomHeader: React.FC<PageProps> = ({ session }) => {
  const accentBackground = '#EBEBEB'
  const buRed = '#CC0000'

  let pfp = "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg";
    if(session?.user?.image){
         pfp = session.user.image
    }

  return (
    <Header style={{ background: accentBackground, borderBottom: `0.3rem solid ${buRed}`, paddingLeft: '0.2rem', display: 'flex', alignItems: 'center' }}>
    <Image src={icon} alt="logo" style={{ height: '3rem', width: 'auto', paddingTop: '0.5rem' }} />
    <img src={pfp} alt="pfp" style={{ marginRight: '-1rem',marginLeft: 'auto', height: '2.5rem', width: 'auto', borderRadius: '50%', border: `0.1rem solid ${buRed}` }} />
  </Header>
  );
};

export default CustomHeader;