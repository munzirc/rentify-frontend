import { UserContext } from "../../context/UserContext";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useRef, useContext, useState, useEffect } from "react";
import { HiCloudUpload, HiPlusCircle } from "react-icons/hi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

const UpdatePost = () => {
  const { postToUpdate, setPostToUpdate } = useContext(UserContext);

  console.log(postToUpdate);
  const [imagefile, setImageFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(()=> {

    if(!postToUpdate)
    {
        navigate('/');
    }
    setImageUrl(postToUpdate.imageUrl);
  },[])

  const [formErrors, setFormErrors] = React.useState({
    imageUrl: "",
    propertyName: "",
    address: "",
    city: "",
    propertyType: "",
    rent: "",
  });

  const filePickerRef = useRef();

  console.log(postToUpdate);

  const handleImageSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    try {
      if (!imagefile) {
        setUploadError("Please select an image");
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + imagefile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imagefile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(Number(progress.toFixed(0)));
        },
        (error) => {
          console.log(error);
          setUploadError("Image Upload Failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploadSuccess("Image uploaded successfully");
            setImageUploadProgress(null);
            setPostToUpdate({ ...postToUpdate, imageUrl: downloadURL });
          });
        }
      );
    } catch (error) {}
  };


  const validateFormData = () => {
    let tempErrors = {};
    tempErrors.propertyName = postToUpdate.propertyName
      ? ""
      : "Property name is required.";
    tempErrors.address = postToUpdate.address ? "" : "Address is required.";
    tempErrors.city = postToUpdate.city ? "" : "City is required";
    tempErrors.propertyType = postToUpdate.propertyType
      ? ""
      : "Please enter the type of Property";
    tempErrors.rent = postToUpdate.rent ? "" : "Rent is required";

    setFormErrors(tempErrors);

    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostToUpdate({ ...postToUpdate, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFormData()) {
      try {
        const uri = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${uri}/api/seller/updateproperty`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postToUpdate),
        });
        const data = await response.json();
        if (data.error) {
          setUploadError(data.error);
          return;
        }
        setUploadSuccess("Updated successfully");
        navigate('/dashboard')
      } catch (error) {
        setUploadError("Somthing went wrong");
      }
    }
  };

  return (
    <div className="p-10 w-full h-full flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelection}
        ref={filePickerRef}
        hidden
      />

      <div
        className={`border-4 border-green-950 border-dotted rounded-lg w-[400px] h-60 flex flex-col items-center justify-center mb-5`}
        onClick={() => filePickerRef.current.click()}
      >
        {imageUrl ? (
          <div
            className={`w-full h-full bg-center bg-cover flex items-center justify-center`}
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            {imageUploadProgress && <CircularProgress color="success" />}
          </div>
        ) : (
          <>
            <HiPlusCircle className="text-6xl" />
            <p className="text-xl ">Add image</p>
          </>
        )}
      </div>

      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        onClick={handleImageUpload}
        startIcon={<HiCloudUpload />}
      >
        Upload file
      </Button>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full flex flex-col items-center mt-5"
      >
        <TextField
          variant="outlined"
          label="Enter Property Name"
          name="propertyName"
          value={postToUpdate.propertyName}
          onChange={handleChange}
          className="w-[50%]"
          error={Boolean(formErrors.propertyName)}
          helperText={formErrors.propertyName}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          variant="outlined"
          label="Address"
          name="address"
          value={postToUpdate.address}
          onChange={handleChange}
          className="w-[50%]"
          error={Boolean(formErrors.address)}
          helperText={formErrors.address}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          variant="outlined"
          label="City"
          name="city"
          value={postToUpdate.city}
          onChange={handleChange}
          className="w-[50%]"
          error={Boolean(formErrors.city)}
          helperText={formErrors.city}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          variant="outlined"
          label="Property Type 1BHK,2BHK..."
          name="propertyType"
          value={postToUpdate.propertyType}
          onChange={handleChange}
          className="w-[50%]"
          error={Boolean(formErrors.propertyType)}
          helperText={formErrors.propertyType}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          variant="outlined"
          label="Rent"
          name="rent"
          value={postToUpdate.rent}
          onChange={handleChange}
          className="w-[50%]"
          error={Boolean(formErrors.rent)}
          helperText={formErrors.rent}
          sx={{ mb: 2 }}
          required
        />
        <Button type="submit" className="px-5" variant="contained" color='success'>
          Update
        </Button>
      </Box>

      <Snackbar
        open={Boolean(uploadSuccess)}
        autoHideDuration={6000}
        onClose={() => setUploadSuccess("")}
      >
        <Alert
          onClose={() => setUploadSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {uploadSuccess}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(uploadError)}
        autoHideDuration={6000}
        onClose={() => setUploadError("")}
      >
        <Alert
          onClose={() => setUploadError("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {uploadError}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UpdatePost;
