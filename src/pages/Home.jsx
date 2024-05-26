import { Button, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import { HiArrowCircleRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Home = () => {
  const navigate = useNavigate();

  const {user, setOpen } = useContext(UserContext);

  const [city, setCity] = useState(null);
  const [error, setError] = useState("");

  const handleClick = () => {

    if(!user) {
      navigate('/')
      setOpen(true);
      return;
    }

    if (!city) {
      setError("Please enter your city");
      return;
    }

    navigate(`/explore/${city}`);
  };

  return (
    <div
      className="flex flex-col min-h-full w-full bg-cover bg-no-repeat py-20 px-40"
      style={{ backgroundImage: `url(/bg-rentify.jpeg)` }}
    >
      <p className="text-6xl font-bold text-white">Rentify</p>
      <p className="text-2xl font-semibold text-blue-950">
        Discover Your Perfect Rental Today
      </p>
      <p className="text-lg text-blue-950 ">
        Find the home that fits your lifestyle. Whether you're looking for a
        cozy apartment, a spacious house, or a luxurious condo, we have a wide
        range of rental properties to suit every need and budget.
      </p>
      <div className="mt-5 flex flex-col w-96 gap-5 ">
        <div className="w-full flex flex-col gap-1">
          <TextField
            variant="outlined"
            label="Enter your city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={Boolean(error)}
            helperText={error}
          />
          <p className="text-xs text-white">Try Bangalore</p>
        </div>
        <Button
          onClick={handleClick}
          variant="contained"
          sx={{
            padding: "10px 10px",
            background: "#c0c0c0",
            "&:hover": {
              backgroundColor: "white",
              color: "black",
            },
          }}
          endIcon={<HiArrowCircleRight />}
        >
          Find Rental Properties
        </Button>
      </div>
    </div>
  );
};

export default Home;
