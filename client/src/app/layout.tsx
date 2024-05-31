import { ReactNode } from 'react';
import { Providers } from './providers';
import CustomHeader from '@/components/Header/CustomHeader';
import CustomSider from '@/components/Sider/CustomSider';
import { useSession } from 'next-auth/react';

const LayoutWithSider = ({ children }: { children: ReactNode }) => {

  return (
    <>
      <CustomSider/>
      {children}
    </>
  );
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          
            <CustomHeader />
            <LayoutWithSider>
              {children}
            </LayoutWithSider>
          
        </Providers>
      </body>
    </html>
  );
}
