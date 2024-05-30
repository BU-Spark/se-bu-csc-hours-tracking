import { useEffect, useState } from "react";
import { buRed } from "../common/styles";

const Pfp: React.FC<any> = ({ session, height: dimension }) => {
  const [pfp, setPfp] = useState(
    "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg"
  );

  useEffect(() => {
    const getPfp = async () => {
      if (session?.user?.image) {
        return session.user.image;
      }
      return "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg";
    };

    const fetchPfp = async () => {
      const imageUrl = await getPfp();
      setPfp(imageUrl);
    };

    fetchPfp();
  }, [session]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={pfp}
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
