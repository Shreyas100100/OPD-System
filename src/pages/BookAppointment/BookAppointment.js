import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, getDoc, doc, getDocs } from "firebase/firestore";
import "./BookAppointment.css";
import NvBar from "../../components/Navbar/Navbar";
import { getAuth } from "firebase/auth";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";

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

  const [doctorList, setDoctorList] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

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

    const fetchDoctors = async () => {
      try {
        const doctorsCollection = collection(db, "doctors");
        const doctorsSnapshot = await getDocs(doctorsCollection);

        const doctorsData = doctorsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            surname: data.surname,
          };
        });

        setDoctorList(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchUserDetails();
    fetchDoctors();
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
        setSnackbarMessage("Please select a future date and time.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
        setSnackbarOpen(false); 
      }
    } else {
      if (!value.trim()) {
        setSnackbarMessage(`Please enter a value for ${name}.`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
        setSnackbarOpen(false); 
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const appointmentsCollection = collection(db, "appointments");
      await addDoc(appointmentsCollection, {
        ...formData,
        patientName: userDetails.name,
        dateOfBirth: userDetails.dob,
        email: userDetails.email,
        uid: userDetails.uid,
        bookDateTime: getCurrentDateTime(),
      });

      setSnackbarMessage("Booking successful! Redirecting...");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setLoading(true);

      setTimeout(() => {
        setSnackbarOpen(false);
        setLoading(false);
        navigate("/scheduled-appointment");
      }, 3000);

      console.log("Appointment details added successfully.");
    } catch (error) {
      console.error("Error adding appointment details:", error);
      setSnackbarMessage("An error occurred. Please try again later.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <div className="book-appointment-container">
      <NvBar />
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label htmlFor="specialistDoctor">Specialist Doctor:</label>
          <TextField
            select
            name="specialistDoctor"
            value={formData.specialistDoctor}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          >
            <MenuItem value="" disabled>
              Select Specialist Doctor
            </MenuItem>
            {doctorList.map((doctor) => (
              <MenuItem
                key={doctor.id}
                value={`${doctor.name} ${doctor.surname}`}
              >
                {`${doctor.name} ${doctor.surname}`}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="form-group">
          <label htmlFor="bloodGroup">Blood Group:</label>
          <TextField
            select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
          >
            <MenuItem value="" disabled>
              Select Blood Group
            </MenuItem>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </TextField>
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
          <label htmlFor="appointmentDateTime">Choose Appointment Date</label>
          <TextField
            type="date"
            name="appointmentDateTime"
            value={formData.appointmentDateTime}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          className="submit-button"
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={snackbarSeverity}
          onClose={handleSnackbarClose}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default BookAppointment;
