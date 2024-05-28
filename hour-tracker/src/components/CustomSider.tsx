import React from 'react'
import {PageProps} from '@/common/interfaces'
import {Layout} from 'antd'
const { Sider } = Layout;
import { buRed, accentBackground } from '@/common/styles';


const CustomSider: React.FC<PageProps> = ({ session }) => {
  return (
    <Sider style={{ background: 'white', marginTop: '0em', overflow: 'auto', height: '100vh', position: 'absolute', zIndex: 2, left: 0, top: 0, boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)' }}>
      <div style={{ padding: '0.5em 0.5em', margin: '5em 0.5em', background: 'grey'}}>
        <p>Image here</p>
      </div>
    </Sider>
  )
}

export default CustomSider