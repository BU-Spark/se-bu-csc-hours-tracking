import { ReactNode } from 'react';
import { Providers } from './providers';
import CustomHeader from '@/components/Header/CustomHeader';
import { SessionProvider } from 'next-auth/react';
import CustomSider from '@/components/Sider/CustomSider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>

            <CustomHeader />
            {children}

        </Providers>
      </body>
    </html>
  );
}