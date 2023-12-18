import React from "react";
import { Button, Card, Grid, Typography } from "@mui/material";
import { useUserAuth } from "../../context/UserAuthContext";
import { getAuth, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";

const auth = getAuth();

const AdminProfile = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      // Delete the user account
      await deleteUser(user);

      // Remove the user from the 'users' collection in the database
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);

      // Optionally, you can perform additional actions after successful deletion
      console.log("User account deleted successfully.");
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDbPgRedirect = () => {
    if (user && user.role === "3") {
      navigate("/DbPg");
    } else {
      console.log("Access denied. User does not have the required role.");
      // Optionally show a message or perform another action for users without the required role.
    }
  };

  return (
    <div className="profile-container">
      <AdminNavbar />
      <Grid container spacing={2} justifyContent="center">
        <Grid item md={4}>
          <Card>
            <Typography variant="h5" align="center" mt={2}>
              Welcome, {user && user.email}
            </Typography>
            <Typography variant="body1" align="center" mb={2}>
              UID: {user && user.uid}
            </Typography>
            <Typography variant="body2" align="center" mb={2}>
              Role: {user && user.role}
            </Typography>
            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <Button variant="contained" color="primary" onClick={handleLogout}>
                Log out
              </Button>
            </div>
            <div style={{ textAlign: "center", marginTop: "8px" }}>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete Account
              </Button>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminProfile;