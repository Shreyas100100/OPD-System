// Import necessary libraries
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import "./BookAppointment.css";
import NvBar from "../../components/Navbar/Navbar";
import { getAuth } from "firebase/auth";
import { useUserAuth } from "../../context/UserAuthContext";
import { Button, Card, Row, Col } from "react-bootstrap";
import Disp from "../Database/Disp";
import { Link, useNavigate } from "react-router-dom";

const BookAppointment = () => {
  const auth = getAuth();
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    specialistDoctor: "",
    bloodGroup: "",
    patientName: "",
    contactNumber: "",
    dateOfBirth: "",
    appointmentDateTime: "",
  });

  const [userDetails, setUserDetails] = useState({
    name: "",
    surname: "",
    dob: "",
    email: "",
    uid: "",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserDetails({
            name: userData.name || "",
            surname: userData.surname || "",
            dob: userData.dob || "",
            email: userData.email || "",
            uid: user.uid,
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [user.uid]);

  const getCurrentDateTime = () => {
    const currentDateTime = new Date();
    return currentDateTime.toISOString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "appointmentDateTime") {
      const selectedDateTime = new Date(value);
      const currentDateTime = new Date();

      if (selectedDateTime < currentDateTime) {
        setFormError("Please select a future date and time.");
        return;
      } else {
        setFormError("");
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const isFormValid = () => {
    return (
      formData.specialistDoctor &&
      formData.bloodGroup &&
      formData.contactNumber &&
      formData.appointmentDateTime &&
      !formError
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    try {
      const appointmentsCollection = collection(db, "appointments");
      await addDoc(appointmentsCollection, {
        ...formData,
        patientName: userDetails.name,
        dateOfBirth: userDetails.dob,
        email: userDetails.email,
        uid: userDetails.uid,
        bookDateTime: getCurrentDateTime(), // Add the current date and time of booking
      });

      setShowSnackbar(true);
      setLoading(true);

      setTimeout(() => {
        setShowSnackbar(false);
        setLoading(false);
        navigate("/scheduled-appointment");
      }, 3000);

      console.log("Appointment details added successfully.");
    } catch (error) {
      console.error("Error adding appointment details:", error);
      setFormError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="book-appointment-container">
      <NvBar />
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label htmlFor="specialistDoctor">Specialist Doctor:</label>
          <input
            type="text"
            name="specialistDoctor"
            value={formData.specialistDoctor}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="bloodGroup">Blood Group:</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="patientName">Patient's Name:</label>
          <input
            type="text"
            name="patientName"
            value={userDetails.name}
            readOnly
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={userDetails.dob}
            readOnly
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="appointmentDateTime">
            Appointment Date and Time:
          </label>
          <input
            type="datetime-local"
            name="appointmentDateTime"
            value={formData.appointmentDateTime}
            onChange={handleChange}
            required
          />
          {formError && <div className="error-message">{formError}</div>}
        </div>
        <button type="submit" disabled={!isFormValid()}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {showSnackbar && (
        <div className="snackbar success">
          Booking successful! Redirecting...
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
