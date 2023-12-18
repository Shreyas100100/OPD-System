// AdminBook.jsx

import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import { useUserAuth } from "../../context/UserAuthContext";
import "./AdminBook.css"; // Import the CSS file

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const AdminBook = () => {
  const { user } = useUserAuth();
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [liveAppointmentsCount, setLiveAppointmentsCount] = useState(0);
  const [previousAppointmentsCount, setPreviousAppointmentsCount] = useState(0);
  const [openAddAppointmentDialog, setOpenAddAppointmentDialog] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    uid: "",
    patientName: "",
    email: "",
    specialistDoctor: "",
    bloodGroup: "",
    contactNumber: "",
    appointmentDateTime: "2023-12-22", // Sample default value
  });

  const [patientsList, setPatientsList] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);

  useEffect(() => {
    const fetchAppointmentsCount = async () => {
      try {
        const appointmentsCollection = collection(db, "appointments");
        const appointmentsSnapshot = await getDocs(appointmentsCollection);
        setAppointmentsCount(appointmentsSnapshot.size);

        const currentDate = new Date();

        const liveAppointmentsSnapshot = appointmentsSnapshot.docs.filter(
          (doc) => doc.data().appointmentDateTime.toDate() > currentDate
        );
        setLiveAppointmentsCount(liveAppointmentsSnapshot.length);

        const previousAppointmentsSnapshot = appointmentsSnapshot.docs.filter(
          (doc) => doc.data().appointmentDateTime.toDate() < currentDate
        );
        setPreviousAppointmentsCount(previousAppointmentsSnapshot.length);
      } catch (error) {
        console.error("Error fetching appointments count:", error);
      }
    };

    const fetchDoctorsList = async () => {
      try {
        const doctorsCollection = collection(db, "users");
        const doctorsQuery = query(doctorsCollection, where("role", "==", "Doctor"));
        const doctorsSnapshot = await getDocs(doctorsQuery);

        const doctorsData = doctorsSnapshot.docs.map((doc) => ({
          uid: doc.id,
          name: doc.data().name,
          surname: doc.data().surname,
        }));

        setDoctorsList(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors list:", error);
      }
    };

    const fetchPatientsCount = async () => {
      try {
        const patientsCollection = collection(db, "users");
        const patientsQuery = query(patientsCollection, where("role", "==", "Patient"));
        const patientsSnapshot = await getDocs(patientsQuery);
        setPatientsCount(patientsSnapshot.size);

        const patientsData = patientsSnapshot.docs.map((doc) => ({
          uid: doc.id,
          name: doc.data().name,
          surname: doc.data().surname,
          email: doc.data().email,
        }));
        setPatientsList(patientsData);
      } catch (error) {
        console.error("Error fetching patients count:", error);
      }
    };

    fetchAppointmentsCount();
    fetchDoctorsList();
    fetchPatientsCount();
  }, []);

  const handleOpenAddAppointmentDialog = () => {
    setOpenAddAppointmentDialog(true);
  };

  const handleCloseAddAppointmentDialog = () => {
    setOpenAddAppointmentDialog(false);
  };

  const handleSelectPatient = (event, patient) => {
    if (patient) {
      setNewAppointment({
        ...newAppointment,
        uid: patient.uid,
        patientName: patient.name,
        email: patient.email,
        specialistDoctor: "", // Reset specialistDoctor when selecting a new patient
      });
    } else {
      setNewAppointment({
        ...newAppointment,
        uid: "",
        patientName: "",
        email: "",
        specialistDoctor: "",
      });
    }
  };

  const handleSelectDoctor = (event, doctor) => {
    if (doctor) {
      const specialistDoctor = `${doctor.name} ${doctor.surname}`;
      setNewAppointment({
        ...newAppointment,
        specialistDoctor,
      });
    } else {
      setNewAppointment({
        ...newAppointment,
        specialistDoctor: "",
      });
    }
  };

  const handleAppointmentSubmission = async () => {
    try {
      const appointmentsCollection = collection(db, "appointments");
      await addDoc(appointmentsCollection, {
        ...newAppointment,
        bookDateTime: new Date().toISOString(),
      });

      handleCloseAddAppointmentDialog();
    } catch (error) {
      console.error("Error adding appointment details:", error);
    }
  };

  return (
    <Container className="admin-profile-container">
      <AdminNavbar />
      <Typography variant="h4" align="center" gutterBottom>
        Admin Book
      </Typography>
      <Box className="admin-profile-boxes" sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Paper elevation={3} className="admin-profile-box" sx={{ flex: '1 1 300px', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Appointments Count
          </Typography>
          <Typography variant="h4">{appointmentsCount}</Typography>
          <Typography variant="subtitle2">Live Appointments: {liveAppointmentsCount}</Typography>
          <Typography variant="subtitle2">Previous Appointments: {previousAppointmentsCount}</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleOpenAddAppointmentDialog}>
            Add Appointment
          </Button>
        </Paper>
        <Paper elevation={3} className="admin-profile-box" sx={{ flex: '1 1 300px', p: 2 }}>
          {/* Additional boxes or content can be added here */}
        </Paper>
      </Box>
      <Box className="admin-profile-boxes" sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Paper elevation={3} className="admin-profile-box" sx={{ flex: '1 1 600px', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add Appointment
          </Typography>
          <Box className="admin-form" sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Autocomplete
              options={patientsList}
              getOptionLabel={(option) => `${option.name} ${option.surname} (${option.email})`}
              onChange={handleSelectPatient}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Patient"
                  variant="outlined"
                  fullWidth
                  className="admin-autocomplete"
                />
              )}
            />
            <Autocomplete
              options={doctorsList}
              getOptionLabel={(option) => `${option.name} ${option.surname}`}
              onChange={handleSelectDoctor}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Doctor"
                  variant="outlined"
                  fullWidth
                  className="admin-autocomplete"
                />
              )}
            />
            <Autocomplete
              options={bloodGroups}
              getOptionLabel={(option) => option}
              onChange={(event, value) => setNewAppointment({ ...newAppointment, bloodGroup: value })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Blood Group"
                  variant="outlined"
                  fullWidth
                  className="admin-autocomplete"
                />
              )}
            />
            <TextField
              label="Contact Number"
              variant="outlined"
              fullWidth
              value={newAppointment.contactNumber}
              onChange={(e) => setNewAppointment({ ...newAppointment, contactNumber: e.target.value })}
              className="admin-textfield"
            />
            <TextField
              label="Appointment Date and Time"
              type="datetime-local"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={newAppointment.appointmentDateTime}
              onChange={(e) => setNewAppointment({ ...newAppointment, appointmentDateTime: e.target.value })}
              className="admin-textfield"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAppointmentSubmission}
              sx={{ mt: 2 }}
            >
              Add Appointment
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminBook;
