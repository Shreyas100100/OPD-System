import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { Container, Box, Typography, Paper } from "@mui/material";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";

const AdminProfile = () => {
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [liveAppointmentsCount, setLiveAppointmentsCount] = useState(0);
  const [previousAppointmentsCount, setPreviousAppointmentsCount] = useState(0);

  useEffect(() => {
    const fetchAppointmentsCount = async () => {
      try {
        const appointmentsCollection = collection(db, "appointments");
        const appointmentsSnapshot = await getDocs(appointmentsCollection);
        setAppointmentsCount(appointmentsSnapshot.size);

        const currentDate = new Date();

        // Count live appointments
        const liveAppointmentsSnapshot = appointmentsSnapshot.docs.filter(
          (doc) => doc.data().appointmentDateTime.toDate() > currentDate
        );
        setLiveAppointmentsCount(liveAppointmentsSnapshot.length);

        // Count previous appointments
        const previousAppointmentsSnapshot = appointmentsSnapshot.docs.filter(
          (doc) => doc.data().appointmentDateTime.toDate() < currentDate
        );
        setPreviousAppointmentsCount(previousAppointmentsSnapshot.length);
      } catch (error) {
        console.error("Error fetching appointments count:", error);
      }
    };

    const fetchDoctorsCount = async () => {
      try {
        const doctorsCollection = collection(db, "users");
        const doctorsQuery = query(doctorsCollection, where("role", "==", "Doctor"));
        const doctorsSnapshot = await getDocs(doctorsQuery);
        setDoctorsCount(doctorsSnapshot.size);
      } catch (error) {
        console.error("Error fetching doctors count:", error);
      }
    };

    const fetchPatientsCount = async () => {
      try {
        const patientsCollection = collection(db, "users");
        const patientsQuery = query(patientsCollection, where("role", "==", "Patient"));
        const patientsSnapshot = await getDocs(patientsQuery);
        setPatientsCount(patientsSnapshot.size);
      } catch (error) {
        console.error("Error fetching patients count:", error);
      }
    };

    fetchAppointmentsCount();
    fetchDoctorsCount();
    fetchPatientsCount();
  }, []);

  return (
    <Container className="admin-profile-container">
      <AdminNavbar />
      <Typography variant="h4" align="center" gutterBottom>
        Admin Profile
      </Typography>
      <Box className="admin-profile-boxes">
        <Paper elevation={3} className="admin-profile-box">
          <Typography variant="h6" gutterBottom>
            Appointments Count
          </Typography>
          <Typography variant="h4">{appointmentsCount}</Typography>
          <Typography variant="subtitle2">Live Appointments: {liveAppointmentsCount}</Typography>
          <Typography variant="subtitle2">Previous Appointments: {previousAppointmentsCount}</Typography>
        </Paper>
        <Paper elevation={3} className="admin-profile-box">
          <Typography variant="h6" gutterBottom>
            Doctors Count
          </Typography>
          <Typography variant="h4">{doctorsCount}</Typography>
        </Paper>
        <Paper elevation={3} className="admin-profile-box">
          <Typography variant="h6" gutterBottom>
            Patients Count
          </Typography>
          <Typography variant="h4">{patientsCount}</Typography>
        </Paper>
        {/* Add more boxes as needed */}
      </Box>
    </Container>
  );
};

export default AdminProfile;
