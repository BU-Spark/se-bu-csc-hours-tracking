/* eslint-disable @next/next/no-img-element */
import { buRed } from "../common/styles";
import { useSession } from "next-auth/react";

const Pfp: React.FC<any> = ({ height: dimension }) => {
  const defaultImageUrl =
    "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg";
  const { data: session, status } = useSession();

  return session?.user?.image ? (
    <img
      src={session.user.image}
      alt="pfp"
      style={{
        height: dimension,
        width: dimension,
        borderRadius: "50%",
        border: `0.1rem solid ${buRed}`,
      }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = defaultImageUrl;
      }}
    />
  ) : (
    <img
      src={defaultImageUrl}
      alt="default pfp"
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
