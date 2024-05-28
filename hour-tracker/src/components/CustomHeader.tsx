import React from 'react';
import { Layout, Menu, theme } from 'antd';
import Image from 'next/image';
import icon from '../../public/full_logo.png'
import { PageProps } from '@/common/interfaces';
import { buRed, accentBackground } from '@/common/styles';
import Pfp from "./Pfp";

const { Header, Content, Footer, Sider } = Layout;

const CustomHeader: React.FC<PageProps> = ({ session }) => {


  

  return (
    <Header
      style={{
        height: "4em",
        zIndex: 4,
        background: accentBackground,
        borderBottom: `0.3rem solid ${buRed}`,
        paddingLeft: "0.2rem",
        display: "flex",
        alignItems: "center",
        margin: 0,
      }}
    >
      <Image
        src={icon}
        alt="logo"
        style={{ height: "3rem", width: "auto", paddingTop: "0.5rem" }}
      />
      <div
        style={{
          marginRight: "-1rem",
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pfp session={session} height={"2.5rem"} />
      </div>
    </Header>
  );
};

export default CustomHeader;