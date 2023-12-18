import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { RiLogoutCircleLine, RiDeleteBin2Line } from "react-icons/ri"; 
import { FaNewspaper, FaMicrophoneAlt, FaBullhorn } from "react-icons/fa";
import { useUserAuth } from "../../context/UserAuthContext";
import { getAuth, deleteUser } from "firebase/auth";
import { FaUserFriends } from "react-icons/fa";
import { FaCapsules } from "react-icons/fa";
import {
  doc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import DoctorNavbar from "../../components/DoctorNavbar/DoctorNavbar";

const calculateExperience = (startDate) => {
  const today = new Date();
  const startYear = new Date(startDate).getFullYear();
  const currentYear = today.getFullYear();
  return currentYear - startYear;
};

const DoctorProfile = () => {
  const { logOut, user } = useUserAuth();
  const [doctorData, setDoctorData] = useState(null);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [currentExperience, setCurrentExperience] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          setDoctorData(docSnapshot.data());
          setCurrentExperience(
            calculateExperience(docSnapshot.data().startDate)
          );
        } else {
          console.log("Doctor data not found.");
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchPreviousAppointments = async () => {
      try {
        const appointmentsCollectionRef = collection(db, "appointments");
        const q = query(
          appointmentsCollectionRef,
          where("uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const appointments = [];
        querySnapshot.forEach((doc) => {
          appointments.push(doc.data());
        });

        setPreviousAppointments(appointments);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDoctorData();
    fetchPreviousAppointments();

    const experienceInterval = setInterval(() => {
      setCurrentExperience(calculateExperience(doctorData?.startDate));
    }, 1000);

    return () => clearInterval(experienceInterval);
  }, [user, doctorData]);

  const handleDelete = async () => {
    try {
      await deleteUser(user);

      const doctorDocRef = doc(db, "doctors", user.uid);
      await deleteDoc(doctorDocRef);

      console.log("Doctor account deleted successfully.");
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
    return (
    <div className="profile-container">
      <DoctorNavbar />
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h2 className="welcome-message">
                Welcome Dr. {doctorData && doctorData.name}!
              </h2>
              {doctorData && (
                <>
                  <p>First Name: {doctorData.name}</p>
                  <p>Last Name: {doctorData.surname}</p>
                  <p>Date of Birth: {doctorData.dob}</p>
                </>
              )}
              <div className="button-section">
                <Button variant="primary" onClick={handleLogout}>
                Log out 
                </Button>
              </div>
              <div className="button-section">
                <Button variant="danger" onClick={handleDelete}>
                  Delete Account <RiDeleteBin2Line />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Col>
            <Card>
              <Card.Body>
                <h3><FaNewspaper />  NEWS </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <h3><FaMicrophoneAlt /> CONFERENCES </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <h3><FaBullhorn />  ANNOUNCEMENTS </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <h3><FaUserFriends />  REFERRALS </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <h3><FaCapsules  />  MEDICINES </h3>
              </Card.Body>
            </Card>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorProfile;
