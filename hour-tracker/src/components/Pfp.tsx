import { buRed } from "../common/styles";

const Pfp: React.FC<any> = ({ session, height: dimension }) => {
  let pfp =
    "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg";
  if (session?.user?.image) {
    pfp = session.user.image;
  }
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
