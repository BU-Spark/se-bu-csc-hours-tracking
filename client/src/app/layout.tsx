import "./page.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import CustomHeader from "@/components/Header/CustomHeader";
import CustomSider from "@/components/Sider/CustomSider";
import { Content } from "antd/es/layout/layout";
import BodyHeader from "@/components/BodyHeader";
import EventSider from "@/components/Sider/EventSider";
import AdminEventSider from "@/components/Sider/AdminEventSider";
import ThirdPartySider from "@/components/Sider/ThirdPartySider";

const LayoutWithSider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ThirdPartySider />
      <AdminEventSider />
      <CustomSider />
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
            <Content
              style={{
                marginLeft: "15rem",
                marginTop: "2rem",
                marginRight: "2rem",
              }}
            >
              <BodyHeader />
              {children}
              <EventSider />
            </Content>
          </LayoutWithSider>
        </Providers>
      </body>
    </html>
  );
}
