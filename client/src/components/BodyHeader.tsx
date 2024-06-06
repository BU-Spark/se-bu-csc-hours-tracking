"use client"
import { Typography } from "antd"
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const BodyHeader: React.FC = () => {
  const { data: session, status } = useSession();
  const useFormatPath = () => {
    const path = usePathname();
    if (path != null && !undefined && !path.substring(1).includes('/')) {
      if (path?.length != null && path.length > 1) {
        const formatted = path[1].toUpperCase() + path.substring(2);
        return formatted;
      } else {
        return "Dashboard";
      }
    }
  };
  const path = useFormatPath();

  return <>{session?.user ? <h3>{path}</h3> : <></>}</>;
};

export default BodyHeader