import { useEffect, useState } from "react";
import { buRed } from "../common/styles";
import { useSession } from "next-auth/react";

const Pfp: React.FC<any> = ({height: dimension }) => {
  const defaultImageUrl = "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg";
  const { data: session, status } = useSession();
  
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={session?.user?.image || defaultImageUrl}
      alt="pfp"
      style={{
        height: dimension,
        width: dimension,
        borderRadius: "50%",
        border: `0.1rem solid ${buRed}`,
      }}
    />
  );
};

export default Pfp;
