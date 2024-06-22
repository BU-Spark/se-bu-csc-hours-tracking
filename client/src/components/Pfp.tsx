/* eslint-disable @next/next/no-img-element */
import { buRed } from "../_common/styles";

const Pfp: React.FC<any> = ({ dimension, sessionImage }) => {
  const defaultImageUrl =
    "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg";
  return (
    <img
      src={sessionImage || defaultImageUrl}
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
  );
};

export default Pfp;
