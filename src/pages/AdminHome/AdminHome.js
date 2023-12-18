import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Container, Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";
import { useUserAuth } from "../../context/UserAuthContext";
import AdminBook from "./AdminBook";

const AdminHome = () => {
  const { user } = useUserAuth();
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
 

  useEffect(() => {
    const fetchAppointmentsCount = async () => {
      try {
        const appointmentsCollection = collection(db, "appointments");
        const appointmentsSnapshot = await getDocs(appointmentsCollection);
        setAppointmentsCount(appointmentsSnapshot.size);

        const currentDate = new Date();
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
        WELCOME ADMIN 
      </Typography>
      <Box className="admin-profile-boxes" sx={{ display: 'flex', gap: '16px' }}>
        <Paper elevation={3} className="admin-profile-box" sx={{ flex: 1, p: 2 }}>
          <Typography variant="h4">{appointmentsCount} Appointments</Typography>
          </Paper>
        <Paper elevation={3} className="admin-profile-box" sx={{ flex: 1, p: 2 }}>
         
          <Typography variant="h4">{doctorsCount} Doctors</Typography>
        </Paper>
        <Paper elevation={3} className="admin-profile-box" sx={{ flex: 1, p: 2 }}>
          
          <Typography variant="h4">{patientsCount} Patients</Typography>
        </Paper>
      </Box>


      <AdminBook />
    </Container>
  );
};

export default AdminHome;
