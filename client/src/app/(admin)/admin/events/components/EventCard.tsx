interface EventCardProps {
    count: number;
    label: string;
    link?: string;
  }
  
  export default function EventCard({ count, label, link = "#" }: EventCardProps) {
    return (
      <div
        style={{
          border: "2px solid #CC0000",
          borderRadius: "12px",
          padding: "1.5rem",
          width: "30%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <span
            style={{
              color: "#CC0000",
              fontSize: "4rem",
              fontWeight: "bold",
              lineHeight: "1",
            }}
          >
            {count}
          </span>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              textAlign: "right",
              paddingTop: "0.5rem",
            }}
          >
            {label}
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            borderTop: "1px solid #eaeaea",
            paddingTop: "0.5rem",
          }}
        >
          <a
            href={link}
            style={{
              color: "#000",
              textDecoration: "underline",
              fontSize: "0.9rem",
            }}
          >
            View more
          </a>
        </div>
      </div>
    );
  }