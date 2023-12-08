// Import necessary libraries
import React, { useEffect, useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { useUserAuth } from "../../context/UserAuthContext";
import { getAuth, deleteUser } from "firebase/auth";
import { doc, getDoc, deleteDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import NvBar from "../../components/Navbar/Navbar";
import "./PatientProfile.css"; // Import your CSS file for customization
import { Link, useNavigate } from "react-router-dom";

// Function to calculate age based on date of birth
const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

const PatientProfile = () => {
  const { logOut, user } = useUserAuth();
  const [patientData, setPatientData] = useState(null);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [currentAge, setCurrentAge] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch patient data
    const fetchPatientData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          setPatientData(docSnapshot.data());
          setCurrentAge(calculateAge(docSnapshot.data().dob));
        } else {
          console.log("Patient data not found.");
        }
      } catch (err) {
        console.log(err);
      }
    };

    // Fetch previous appointments
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

    fetchPatientData();
    fetchPreviousAppointments();

    // Update the age every second
    const ageInterval = setInterval(() => {
      setCurrentAge(calculateAge(patientData?.dateOfBirth));
    }, 1000); // Update every second

    return () => clearInterval(ageInterval); // Clear interval on component unmount
  }, [user, patientData]);

  const handleDelete = async () => {
    try {
      // Delete the patient account
      await deleteUser(user);

      // Remove the patient from the 'patients' collection in the database
      const patientDocRef = doc(db, "patients", user.uid);
      await deleteDoc(patientDocRef);

      // Optionally, you can perform additional actions after successful deletion
      console.log("Patient account deleted successfully.");
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
      <NvBar />
      <Row>
        {/* Left Column */}
        <Col md={4}>
          <Card>
            <Card.Body>
              <h2>Welcome {patientData && patientData.name} !</h2>
              {patientData && (
                <>
                  {/* <p className="uid-section">UID: {user && user.uid}</p> */}
                  <p>First Name: {patientData.name}</p>
                  <p>Last Name: {patientData.surname}</p>
                  <p>Date of Birth: {patientData.dob}</p>
                  <p>Current Age: {currentAge}</p>
                  {/* Add more patient details here */}
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

        {/* Right Column */}
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
                      {/* Add more appointment details here */}
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

export default PatientProfile;
