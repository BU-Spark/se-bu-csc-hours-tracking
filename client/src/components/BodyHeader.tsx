"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const BodyHeader: React.FC = () => {
  const { data: session, status } = useSession();
  const useFormatPath = () => {
    let path = usePathname();
    // if(path.includes('/user')) 
    //   path = path.substring(5)
    // if(path.includes('/admin')) 
    //   path = path.substring(6)
    if (path != null && !undefined && !path.substring(1).includes("/")) {
      if (path?.length != null && path.length > 1) {
        const pre = path.replace(
          /-(\w)/g,
          (_, letter) => ` ${letter.toUpperCase()}`
        );
        const formatted = pre[1].toUpperCase() + pre.substring(2);
        return formatted;
      } else {
        return "Dashboard";
      }
    }
  };
  const path = useFormatPath();

  return <>{session?.user ? <h3>{path}</h3> : <></>}</>;
};

export default BodyHeader;
