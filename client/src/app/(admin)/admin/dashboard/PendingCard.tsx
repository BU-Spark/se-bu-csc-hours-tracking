import { Card } from 'antd';

type PendingHourCardProps = {
  classYear: number;
  name: string;
  category: string;
  college: string;
  hours: number;
  date: string;
  profilePic: string;
};

export default function PendingCard({
  classYear,
  name,
  college,
  category,
  hours,
  date,
  profilePic,
}: PendingHourCardProps) {
  const year = classYear.toString().slice(-2) + "'";
  const userYear = college.toUpperCase() + " " + year;

  return (
    <Card
      style={{
        marginTop: "1.25rem",
        minWidth: "18rem",
        maxWidth: "18rem",
        backgroundColor: "#CC0000",
        color: "white",
        borderRadius: "1.5625rem",
        border: "0.125rem solid #CC0000",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      title={
        <div style={{ display: "flex", flexDirection: "row", marginTop: "0.1875rem" }}>
          <img
            src={profilePic}
            alt="Profile"
            style={{
              height: "3rem",
              width: "3rem",
              borderRadius: "50%",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", marginLeft: "0.625rem" }}>
            <span style={{ color: "white", fontSize: "1rem" }}>{name}</span>
            <span style={{ fontSize: "0.75rem", color: "white" }}>{userYear}</span>
          </div>
        </div>
      }
      styles={{
        body: {
          backgroundColor: "white",
          color: "black",
          borderBottomLeftRadius: "1.5625rem",
          borderBottomRightRadius: "1.5625rem",
        },
        header: {
          borderTopLeftRadius: "1.5625rem",
          borderTopRightRadius: "1.5625rem",
          height: "4.6875rem",
          marginLeft: "-0.9375rem",
        },
      }}
    >
      <div style={{ marginTop: "-1.875rem", marginBottom: "-0.9375rem" }}>
        <ul
          style={{
            marginLeft: "-3.125rem",
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "0.3125rem",
          }}
        >
          <li>
            <strong>Category: </strong>
            {category}
          </li>
          <li>
            <strong>Hours: </strong>
            {hours}
          </li>
          <li>
            <strong>Date: </strong>
            {date}
          </li>
          <a
            href="#"
            style={{
              marginTop: "0.3125rem",
              textDecoration: "underline",
              color: "#CC0000",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            Full Profile
          </a>
        </ul>
      </div>
    </Card>
  );
}