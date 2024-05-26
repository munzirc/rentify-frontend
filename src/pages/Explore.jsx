import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,

} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Card from "../components/Card";
import { HiSearch } from "react-icons/hi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: 5,
};


const Explore = () => {
  const { city } = useParams();

  const { user, setOpen } = React.useContext(UserContext);

  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(false);
  const [seller, setSeller] = useState(null);

  const [filter, setFilter] = useState({
    searchQuery: "",
    propertyType: "",
    rent: 15000,
  });

  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getProperties = async () => {
      try {
        const params = new URLSearchParams();
        params.set("city", city);
        params.set("searchQuery", filter.searchQuery);
        params.set("propertyType", filter.propertyType);
        params.set("rent", filter.rent);

        const uri = import.meta.env.VITE_BASE_URL;
        const response = await fetch(
          `${uri}/api/common/getproperties?${params.toString()}`
        );
        const data = await response.json();

        setProperties(data.properties);
      } catch (error) {}
    };
    getProperties();
  }, [filter]);

  const handleClick = async (property) => {
    if (!user) {
      navigate("/");
      setOpen(true);
      return;
    }
    if (!property.userId) {
      return;
    }

    try {
      setLoading(true);
      setOpenModal(true);
      const uri = import.meta.env.VITE_BASE_URL;
      const response = await fetch(`${uri}/api/common/sendemail`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Authorization': user.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sellerId: property.userId, buyerId: user._id }),
      });
      const data = await response.json();
      setSeller(data);
      setLoading(false);
    } catch (error) {}
  };

  return (
    <>
      <div className="w-full py-20 px-10 flex gap-10">
        <FormControl>
          <InputLabel id="demo-simple-select-label">Property Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter.propertyType}
            label="Property Type"
            onChange={(e) =>
              setFilter({ ...filter, propertyType: e.target.value })
            }
            sx={{ width: 200 }}
          >
            <MenuItem value={"1BHK"}>1BHK</MenuItem>
            <MenuItem value={"2BHK"}>2BHK</MenuItem>
            <MenuItem value={"3BHK"}>3BHK</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Rent</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter.rent}
            label="Property Type"
            onChange={(e) =>
              setFilter({ ...filter, rent: e.target.value })
            }
            sx={{ width: 200 }}
          >
            <MenuItem value={5000}>{'<5000'}</MenuItem>
            <MenuItem value={8000}>{'<8000'}</MenuItem>
            <MenuItem value={10000}>{'<10000'}</MenuItem>
            <MenuItem value={15000}>{'<15000'}</MenuItem>
            <MenuItem value={20000}>{'<20000'}</MenuItem>
            <MenuItem value={25000}>{'<25000'}</MenuItem>
            <MenuItem value={30000}>{'<30000'}</MenuItem>
          </Select>
        </FormControl>

        <div className="flex w-96 border rounded-md bg-gray-100 ml-10">
          <div className="flex flex-col items-center justify-center p-3">
            <HiSearch size={20} />
          </div>
          <input type="text" placeholder="Search..." className="border-none outline-none w-full" onChange={(e) => setFilter({...filter, searchQuery: e.target.value})} />
        </div>


      </div>
      {properties.length === 0 ? (
        <p className="text-center text-xl font-bold">No rental properties found in {city}</p>
      ) : (
        <div className="grid  sm:grid-cols-2 lg:grid-cols-3 gap-5 px-10">
          {properties.map((property) => (
            <Card
              property={property}
              handleClick={handleClick}
              key={property._id}
            />
          ))}
        </div>
      )}

      {seller && (
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {loading ? (
              <div className="flex flex-col items-center p-5">
                <CircularProgress color="success" />
              </div>
            ) : (
              <>
                <p className="text-center text-xl font-bold">Seller Details</p>
                <div className="mt-3 flex flex-col items-center">
                  <p className="text-base">
                    Name: {seller.fname + " " + seller.lname}
                  </p>
                  <p className="text-base">Email: {seller.email}</p>
                  <p className="text-base">Phone Number: {seller.phone}</p>
                </div>
              </>
            )}
          </Box>
        </Modal>
      )}
    </>
  );
};

export default Explore;
