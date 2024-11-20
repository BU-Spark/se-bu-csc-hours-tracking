"use client";
import { useSession } from '@clerk/clerk-react';
import { usePathname } from "next/navigation";

const BodyHeader: React.FC = () => {
  const { session, isSignedIn } = useSession();
  const excludedPaths = ["/unauthorized"];
  const path: string = usePathname();
  const useFormatPath = (path: string) => {
    if (path.includes("/user")) path = path.substring(5);
    if (path.includes("/admin")) path = path.substring(6);
    if (path != null && !isSignedIn && !path.substring(1).includes("/")) {
      if (path?.length != null && path.length > 1) {
        const pre = path.replace(
          /-(\w)/g,
          (_, letter) => ` ${letter.toUpperCase()}`
        );
        const formatted = pre[1].toUpperCase() + pre.substring(2);
        return formatted;
      } else {
        return "Welcome";
      }
    }
  };
  const formattedPath = useFormatPath(path);

  return (
    <>
      {session?.user && !excludedPaths.includes(path) ? (
        <h3>{formattedPath}</h3>
      ) : (
        <></>
      )}
    </>
  );
};

export default BodyHeader;
