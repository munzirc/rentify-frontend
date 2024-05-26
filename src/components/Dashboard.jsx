import {
  Alert,
  Box,
  Button,
  Modal,
  Pagination,
  Snackbar,
  Stack,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = React.useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [postCount, setPostCount] = useState(0);

  const [pageNum, setPageNum] = useState(1);

  const { user, setPostToUpdate } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    const getProperties = async () => {
      try {
        const uri = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${uri}/api/seller/getproperties`, {
          credentials: "include",
          method: 'GET',
          headers: {
            'Authorization': user.token,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        }
        setProperties(data.properties);
        setPostCount(data.count);
      } catch (error) {
        setError(error.message);
      }
    };
    getProperties();
  }, []);

  const handleUpdate = (property) => {
    sessionStorage.setItem("property", JSON.stringify(property));
    setPostToUpdate(property);
    navigate("/update-post");
  };

  const handleDelete = async () => {
    setProperties(
      properties.filter((prev) => prev._id !== propertyToDelete._id)
    );
    setOpen(false);
    try {
      const uri = import.meta.env.VITE_BASE_URL;
      const response = await fetch(
        `${uri}/api/seller/deleteproperty/${propertyToDelete._id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': user.token,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setSuccess(data.message);
    } catch (error) {
      setError(error.message);
    }
  };

  const openModal = (property) => {
    setPropertyToDelete(property);
    setOpen(true);
  };

  const handleClose = () => {
    setPropertyToDelete(null);
    setOpen(false);
  };

  const handlePageChange = async (event, value) => {
    try {
      const uri = import.meta.env.VITE_BASE_URL;
      const response = await fetch(
        `${uri}/api/seller/getproperties?page=${value}`,
        {
          method: "GET",
          credentials: 'include',
          headers: {
            'Authorization': user.token,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      }
      setProperties(data.properties);
      setPostCount(data.count);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      {properties && properties.length === 0 ? (
        <div className="text-center mt-28">
          <p className="text-xl font-bold">You haven't posted anything yet!</p>
          <p className="text-base">Start posting properties to get started</p>
        </div>
      ) : (
        <div className="p-10 grid lg:grid-cols-2 gap-5">
          {properties.map((property) => (
            <div className="bg-white rounded-lg p-3 flex">
              <div className="w-52 h-32">
                <img
                  src={property.imageUrl}
                  className="h-full w-full rounded-md"
                />
              </div>
              <div className="px-3 w-full">
                <p className="text-xl font-bold">{property.propertyName}</p>
                <p>{property.address + "," + property.city}</p>
                <p>{property.propertyType}</p>
                <p>{"₹ " + property.rent}</p>

                <div className="mt-2 flex justify-between w-full">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleUpdate(property)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => openModal(property)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <p>Are you sure you want to delete this post?</p>
          <div className="flex justify-around mt-5">
            <Button variant="contained" color="error" onClick={handleDelete}>
              Yes
            </Button>
            <Button variant="contained" color="info" onClick={handleClose}>
              No
            </Button>
          </div>
        </Box>
      </Modal>

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={6000}
        onClose={() => setSuccess("")}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {properties.length !== 0 && postCount > 6 && (
        <div className="flex flex-col items-center w-full">
          <Stack spacing={2}>
            <Pagination
              onChange={handlePageChange}
              count={Math.ceil(postCount / 6)}
              variant="outlined"
              color="secondary"
            />
          </Stack>
        </div>
      )}
    </>
  );
};

export default Dashboard;
