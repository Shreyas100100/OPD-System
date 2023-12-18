// DoctorProfile.js
import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { useUserAuth } from "../../context/UserAuthContext";
import { getAuth, deleteUser } from "firebase/auth";
import { doc, getDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import NvBar from "../../components/Navbar/Navbar";
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
          setCurrentExperience(calculateExperience(docSnapshot.data().startDate));
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
        const q = query(appointmentsCollectionRef, where("uid", "==", user.uid));
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

  const formatDate = (timestamp) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(timestamp).toLocaleDateString("en-US", options);
  };

  const calculateDaysAgo = (timestamp) => {
    const today = new Date();
    const bookingDate = new Date(timestamp);
    const timeDifference = today - bookingDate;
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return daysAgo;
  };

  const calculateDaysUntilAppointment = (timestamp) => {
    const today = new Date();
    const appointmentDate = new Date(timestamp);
    const timeDifference = appointmentDate - today;
    const daysUntil = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysUntil;
  };

  return (
    <div className="profile-container">
      <DoctorNavbar />
      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h2>Welcome Dr. {doctorData && doctorData.name}!</h2>
              {doctorData && (
                <>
                  <p>First Name: {doctorData.name}</p>
                  <p>Last Name: {doctorData.surname}</p>
                  <p>Date of Birth: {doctorData.dob}</p>
                  <p>Start Year: {doctorData.startDate}</p>
                  <p>Current Experience: {currentExperience} years</p>
                </>
              )}
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

        <Col md={8}>
          <Card>
            <Card.Body>
              <h3>Previous Appointments</h3>
              {previousAppointments.length > 0 ? (
                <ul>
                  {previousAppointments.map((appointment, index) => (
                    <li key={index} className="appointment-item">
                      <p>Appointment Date and Time: {formatDate(appointment.appointmentDateTime)}</p>
                      <p>Blood Group: {appointment.bloodGroup}</p>
                      <p>Contact Number: {appointment.contactNumber}</p>
                      <p>Specialist Doctor: {appointment.specialistDoctor}</p>
                      <p>
                        Booked {calculateDaysAgo(appointment.bookDateTime)}{" "}
                        {calculateDaysAgo(appointment.bookDateTime) === 1 ? "day" : "days"} ago
                      </p>
                      {calculateDaysUntilAppointment(appointment.appointmentDateTime) > 0 && (
                        <p>
                          Live in{" "}
                          {calculateDaysUntilAppointment(appointment.appointmentDateTime)}{" "}
                          {calculateDaysUntilAppointment(appointment.appointmentDateTime) === 1
                            ? "day"
                            : "days"}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No previous appointments.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorProfile;
