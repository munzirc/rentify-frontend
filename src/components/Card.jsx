import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";

const Card = ({ property, handleClick }) => {
  const [likes, setLikes] = useState([]);

  const { user, setOpen } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  console.log(likes);

  useEffect(() => {
    const getLikes = async () => {
      try {
        const uri = import.meta.env.VITE_BASE_URL;
        const response = await fetch(
          `${uri}/api/common/getlikes/${property._id}`
        );
        const data = await response.json();
        setLikes(data.likes);
      } catch (error) {}
    };

    getLikes();
  }, []);

  const handleLike = async () => {
    if (!user) {
      navigate("/");
      setOpen(true);
      return;
    }
    setLikes((prevLikes) => [...prevLikes, user._id]);

    try {
      const uri = import.meta.env.VITE_BASE_URL;
      const response = await fetch(
        `${uri}/api/common/addlike/${property._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            'Authorization': user.token,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error)
    }
  };

  const handleUnLike = async () => {

    setLikes((prevLikes) => prevLikes.filter((like) => like !== user._id));

    if (!user) {
      navigate("/");
      setOpen(true);
      return;
    }
    
    try {
      const uri = import.meta.env.VITE_BASE_URL;
      const response = await fetch(
        `${uri}/api/common/removelike/${property._id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            'Authorization': user.token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.json());
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="md:w-[400px] h-60 rounded-md border flex relative">
      <div className="h-full w-[50%] pt-3 pl-3 flex flex-col gap-3">
        <img src={property.imageUrl} className="h-[80%] w-full" />
        <div className="flex gap-2">
          {likes && user && likes.includes(user._id) ? (
            <FavoriteIcon sx={{ color: "red" }} onClick={handleUnLike} />
          ) : (
            <FavoriteBorderOutlinedIcon onClick={handleLike} />
          )}
          {likes && likes.length > 0 && <p>{likes.length}</p>}
        </div>
      </div>
      <div className="py-2 relative h-full w-[50%] px-5">
        <p className="text-lg font-bold">{property.propertyName}</p>
        <p className="text-base">{property.address + ", " + property.city}</p>
        <p className="text-base">{property.propertyType}</p>
        <p className="text-base">{"₹ " + property.rent}</p>

        <Button
          variant="contained"
          sx={{ position: "absolute", bottom: 12 }}
          onClick={() => handleClick(property)}
        >
          I'm interested
        </Button>
      </div>
    </div>
  );
};

export default Card;
