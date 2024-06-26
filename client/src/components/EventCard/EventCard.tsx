import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { buRed } from "@/_common/styles";
import { EventCardProps } from "@/interfaces/interfaces";
import { Person } from "@prisma/client";
import Link from "next/link";
import { getCategoryById, getCoordinatorById } from "./action";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { Category } from "@prisma/client";

const EventCard: React.FC<EventCardProps> = ({
  event_id,
  title,
  category_id,
  coordinator_id,
  location,
  image,
  event_start,
  onClick,
  isAdmin,
}) => {
  const [coordinator, setCoordinator] = useState<Person>();
  const [category, setCategory] = useState<Category>();
  const eventPath = decodeURIComponent(event_id.toString());

  useEffect(() => {
    const fetchCoordinator = async () => {
      const result: Person | undefined = await getCoordinatorById(
        coordinator_id
      );
      if (result) {
        setCoordinator(result);
      }
    };
    fetchCoordinator();

    const fetchCategory = async () => {
      const result = await getCategoryById(category_id);
      if (result) {
        setCategory(result);
      }
    };
    fetchCategory();
  }, [category_id, coordinator_id]);
  return category ? (
    <Link
      href={isAdmin ? `/admin/events/${eventPath}` : `/events/${eventPath}`}
    >
      <Card
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "13rem",
          width: "13rem",
          position: "relative",
          overflow: "hidden",
          marginBottom: "3rem",
        }}
        hoverable
      >
        <div
          style={{
            backgroundColor: `rgba(204, 0, 0, 0.6)`, //change if buRed changes
            height: "7.5em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            zIndex: 2,
          }}
        >
          <div
            className="card-text"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <h3
              style={{
                color: "white",
                zIndex: 3,
                marginTop: "0",
                marginBottom: "0",
                // marginLeft: "0.1rem",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {/* this is not title for some reason */}
              {title}
              {/* {category.name} */}
            </h3>
            <p
              style={{
                color: "white",
                padding: 0,
                margin: 0,
                fontSize: "0.8rem",
              }}
            >
              {coordinator?.name}
            </p>
            <div
              className="location"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
              }}
            >
              <FmdGoodOutlinedIcon style={{ fontSize: "1rem" }} /> {location}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  ) : (
    <p>...</p>
  );
};

export default EventCard;
