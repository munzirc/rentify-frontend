import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { UserContext } from "../../context/UserContext";
import {
  Alert,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};


function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [isLoginLoading, setLoginLoading] = React.useState(false);
  const [isRegisterLoading, setRegisterLoading] = React.useState(false);

  const [logout, setLogout] = React.useState(null);
  const [logoutLoad, setLogoutLoad] = React.useState(false);

  const [regError, setRegError] = React.useState(null);
  const [loginError, setLoginError] = React.useState(null);

  const [values, setValues] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState({ email: "", password: "" });

  const [formData, setFormData] = React.useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
    userType: "buyyer",
  });
  const [formErrors, setFormErrors] = React.useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
    userType: "",
  });

  const navigate = useNavigate();

  const { user, setUser, open, setOpen} = React.useContext(UserContext);

  const [register, setRegister] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)
      ? ""
      : "Email is not valid.";
    tempErrors.password = values.password ? "" : "Password is required.";
    setErrors(tempErrors);

    return Object.values(tempErrors).every((x) => x === "");
  };

  const validateFormData = () => {
    let tempErrors = {};
    tempErrors.fname = formData.fname ? "" : "First name is required.";
    tempErrors.lname = formData.lname ? "" : "Last name is required.";
    tempErrors.phone = /^\d{10}$/.test(formData.phone)
      ? ""
      : "Phone number is not valid. It should be 10 digits.";
    tempErrors.email = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)
      ? ""
      : "Email is not valid.";
    tempErrors.password = formData.password ? "" : "Password is required.";

    setFormErrors(tempErrors);

    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoginLoading(true);
      try {
        const uri = import.meta.env.VITE_BASE_URL;
        const response = await fetch(`${uri}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setUser(data);
        sessionStorage.setItem('user', JSON.stringify(data))
        setLoginLoading(false);
        setValues({ email: "", password: "" });
        setLoginError(null);
        setOpen(false);
        if(data && data.userType === 'seller') {
          navigate('/dashboard')
        }
      } catch (error) {
        setLoginLoading(false);
        setLoginError(error.message);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validateFormData()) {
      setRegisterLoading(true);
      try {
        const uri = import.meta.env.VITE_BASE_URL;

        const response = await fetch(`${uri}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setUser(data);
        sessionStorage.setItem('user', JSON.stringify(data))
        setRegisterLoading(false);
        setFormData({
          fname: "",
          lname: "",
          phone: "",
          email: "",
          password: "",
          userType: "buyyer",
        });
        setRegError(null);
        setRegister(false);
      } catch (error) {
        setRegError(error.message);
        setRegisterLoading(false);
      }
    }
  };

  const handleClick = () => {
    navigate('/')
  }

  const handleFormChange = (openModal, closeModal) => {
    openModal(true);
    closeModal(false);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    setUser(null);
    sessionStorage.removeItem('user')

    try {
      setLogoutLoad(true);
      const uri = import.meta.env.VITE_BASE_URL;
      const response = await fetch(`${uri}/api/auth/logout`);
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setLogout("Logged Out");
      navigate('/')
    } catch (error) {
      setLogout("Internal server error");
    }
  };

  console.log(formData);

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl" style={{ background: "#000" }}>
          <Toolbar
            disableGutters
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box onClick={handleClick}>
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Rentify
              </Typography>
            </Box>

            {user?.token ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  {user.userType === 'seller' && <MenuItem onClick={handleCloseUserMenu}>
                    <Link to={'\dashboard'} textAlign="center">Dashboard</Link>
                  </MenuItem>}
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box>
                <Button
                  variant="contained"
                  style={{ background: "#fff", color: "#000" }}
                  onClick={handleOpen}
                >
                  Login
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          component="form"
          noValidate
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <TextField
            variant="outlined"
            label="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            fullWidth
            error={Boolean(errors.email)}
            helperText={errors.email}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            variant="outlined"
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            fullWidth
            error={Boolean(errors.password)}
            helperText={errors.password}
            sx={{ mb: 2 }}
            required
          />
          <Box className="flex items-center justify-center">
            <Button type="submit" variant="contained" color="primary">
              {isLoginLoading ? (
                <CircularProgress color="secondary" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
          <Box className="mt-3">
            <p className="text-sm inline-flex items-center">
              {" "}
              Don't have an account?
              <Button variant="text">
                <p
                  className="text-sm normal-case"
                  onClick={() => handleFormChange(setRegister, setOpen)}
                >
                  Register
                </p>
              </Button>
            </p>
          </Box>
          {loginError && <Alert severity="error">{loginError}</Alert>}
        </Box>
      </Modal>
      <Modal
        open={register}
        onClose={() => setRegister(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          component="form"
          noValidate
          onSubmit={handleFormSubmit}
          autoComplete="off"
        >
          <TextField
            variant="outlined"
            label="First Name"
            name="fname"
            value={formData.fname}
            onChange={handleFormData}
            fullWidth
            error={Boolean(formErrors.fname)}
            helperText={formErrors.fname}
            sx={{ mb: 2 }}
          />
          <TextField
            variant="outlined"
            label="Last Name"
            name="lname"
            value={formData.lname}
            onChange={handleFormData}
            fullWidth
            error={Boolean(formErrors.lname)}
            helperText={formErrors.lname}
            sx={{ mb: 2 }}
          />
          <TextField
            variant="outlined"
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleFormData}
            fullWidth
            error={Boolean(formErrors.phone)}
            helperText={formErrors.phone}
            sx={{ mb: 2 }}
          />

          <TextField
            variant="outlined"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleFormData}
            fullWidth
            error={Boolean(formErrors.email)}
            helperText={formErrors.email}
            sx={{ mb: 2 }}
          />
          <TextField
            variant="outlined"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleFormData}
            fullWidth
            error={Boolean(formErrors.password)}
            helperText={formErrors.password}
            sx={{ mb: 2 }}
          />

          <RadioGroup
            defaultValue="buyyer"
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={formData.userType}
            onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
          >
            <FormControlLabel
              value="buyyer"
              control={<Radio />}
              label="Buyyer"
            />
            <FormControlLabel
              value="seller"
              control={<Radio />}
              label="Seller"
            />
          </RadioGroup>

          <Box className="flex items-center justify-center">
            <Button type="submit" variant="contained" color="primary">
              {isRegisterLoading ? (
                <CircularProgress color="secondary" />
              ) : (
                "Submit"
              )}
            </Button>
          </Box>
          <Box className="mt-3">
            <p className="text-sm inline-flex items-center">
              {" "}
              Already have an account?
              <Button variant="text">
                <p
                  className="text-sm normal-case"
                  onClick={() => handleFormChange(setOpen, setRegister)}
                >
                  Login
                </p>
              </Button>
            </p>
          </Box>
          {regError && <Alert severity="error">{regError}</Alert>}
        </Box>
      </Modal>
      <Snackbar open={logout} autoHideDuration={6000} onClose={()=> setLogout(false)}>
        <Alert
          onClose={()=> setLogout(false)}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {logout}
        </Alert>
      </Snackbar>
    </>
  );
}
export default Navbar;
