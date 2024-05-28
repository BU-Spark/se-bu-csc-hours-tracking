import React from 'react';
import { Layout, Menu, theme } from 'antd';
import Image from 'next/image';
import icon from '../../public/full_logo.png'

const { Header, Content, Footer, Sider } = Layout;

// const items: MenuProps['items'] = [
//   UserOutlined,
//   VideoCameraOutlined,
//   UploadOutlined,
//   BarChartOutlined,
//   CloudOutlined,
//   AppstoreOutlined,
//   TeamOutlined,
//   ShopOutlined,
// ].map((icon, index) => ({
//   key: String(index + 1),
//   icon: React.createElement(icon),
//   label: `nav ${index + 1}`,
// }));

const CustomHeader: React.FC = () => {
  const accentBackground = '#EBEBEB'
  const buRed = '#CC0000'

  return (
    <Header style={{ background: accentBackground, borderBottom: `0.3rem solid ${buRed}`, paddingLeft: '0.2rem', display: 'flex', alignItems: 'center' }}>
    <Image src={icon} alt="logo" style={{ height: '3rem', width: 'auto', paddingTop: '0.5rem' }} />
    
  </Header>
  );
};

export default CustomHeader;