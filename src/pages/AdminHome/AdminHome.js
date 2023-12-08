import React from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { useUserAuth } from "../../context/UserAuthContext";
import { getAuth, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Disp from "../Database/Disp";
import { Link, useNavigate } from "react-router-dom";
import NvBar from "../../components/Navbar/Navbar";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";


const auth = getAuth();

const AdminHome = () => {
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
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              {/* <Disp /> */}
              <h2>Welcome, {user && user.email}</h2>
              <p className="uid-section">UID: {user && user.uid}</p>
              <p>{user && user.role}</p>
              <div className="button-section">
                <Button variant="primary" onClick={handleLogout}>
                  Log out
                </Button>
              </div>
              <div className="button-section">
                <Button variant="danger" onClick={handleDelete}>
                  Delete Account
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default AdminHome;
