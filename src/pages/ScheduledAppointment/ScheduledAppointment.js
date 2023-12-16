// ScheduledAppointments.js

import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc as firestoreDoc,
  updateDoc,
} from "firebase/firestore";
import NvBar from "../../components/Navbar/Navbar";
import { useUserAuth } from "../../context/UserAuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem, // Import MenuItem
} from "@mui/material";
import "./ScheduledAppointment.css";

const ScheduledAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserAuth();
  const [editAppointment, setEditAppointment] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
  ]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsCollection = collection(db, "appointments");
        const appointmentsQuery = query(
          appointmentsCollection,
          where("uid", "==", user.uid)
        );

        const appointmentsSnapshot = await getDocs(appointmentsQuery);

        const appointmentsData = [];
        appointmentsSnapshot.forEach((doc) => {
          appointmentsData.push({ id: doc.id, ...doc.data() });
        });

        setAppointments(appointmentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        const doctorsCollection = collection(db, "doctors");
        const doctorsSnapshot = await getDocs(doctorsCollection);

        const doctorsData = doctorsSnapshot.docs.map((doc) => doc.data());
        setDoctorList(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchAppointments();
    fetchDoctors();
  }, [user.uid]);

  const handleEdit = (appointment) => {
    setEditAppointment(appointment);
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setEditAppointment(null);
  };

  const handleSaveEdit = async () => {
    try {
      const appointmentRef = firestoreDoc(db, "appointments", editAppointment.id);

      await updateDoc(appointmentRef, {
        specialistDoctor: editAppointment.specialistDoctor,
        bloodGroup: editAppointment.bloodGroup,
        patientName: editAppointment.patientName,
        appointmentDateTime: editAppointment.appointmentDateTime,
        // Add other fields as needed
      });

      // Update the local state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === editAppointment.id ? editAppointment : appointment
        )
      );

      setOpenEditDialog(false);
      setEditAppointment(null);

      console.log(`Appointment with ID ${editAppointment.id} edited successfully.`);
    } catch (error) {
      console.error("Error editing appointment:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const appointmentRef = firestoreDoc(db, "appointments", id);
      await deleteDoc(appointmentRef);

      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== id)
      );

      console.log(`Appointment with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const toggleNavbar = () => {
    const content = document.querySelector(".scheduled-appointments-content");
    content.classList.toggle("opened");
  };

  return (
    <div className="scheduled-appointments-container">
      <NvBar toggleNavbar={toggleNavbar} />
      <div className="scheduled-appointments-content">
        <h2>Scheduled Appointments</h2>
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper} className="TableContainer">
            <Table className="Table">
              <TableHead>
                <TableRow>
                  <TableCell>Specialist Doctor</TableCell>
                  <TableCell>Blood Group</TableCell>
                  <TableCell>Patient's Name</TableCell>
                  <TableCell>Appointment Date </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.specialistDoctor}</TableCell>
                    <TableCell>{appointment.bloodGroup}</TableCell>
                    <TableCell>{appointment.patientName}</TableCell>
                    <TableCell>{appointment.appointmentDateTime}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleEdit(appointment)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={handleEditClose}>
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogContent>
            <TextField
              label="Specialist Doctor"
              select
              fullWidth
              style={{ marginTop: '12px' }}
              value={editAppointment?.specialistDoctor || ""}
              onChange={(e) =>
                setEditAppointment({
                  ...editAppointment,
                  specialistDoctor: e.target.value,
                })
              }
            >
              <MenuItem value="" disabled>
                Select Specialist Doctor
              </MenuItem>
              {doctorList.map((doctor) => (
                <MenuItem key={doctor.id} value={`${doctor.name} ${doctor.surname}`}>
                  {`${doctor.name} ${doctor.surname}`}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Blood Group"
              select
              fullWidth
              style={{ marginTop: '12px' }}
              value={editAppointment?.bloodGroup || ""}
              onChange={(e) =>
                setEditAppointment({
                  ...editAppointment,
                  bloodGroup: e.target.value,
                })
              }
            >
              <MenuItem value="" disabled>
                Select Blood Group
              </MenuItem>
              {bloodGroups.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Patient's Name"
              fullWidth
              style={{ marginTop: '12px' }}
              value={editAppointment?.patientName || ""}
              onChange={(e) =>
                setEditAppointment({
                  ...editAppointment,
                  patientName: e.target.value,
                })
              }
            />
            <TextField
              label="Appointment Date"
              type="date"
              fullWidth
              style={{ marginTop: '12px' }}
              value={editAppointment?.appointmentDateTime || ""}
              onChange={(e) =>
                setEditAppointment({
                  ...editAppointment,
                  appointmentDateTime: e.target.value,
                })
              }
            />
            {/* Add other fields as needed */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveEdit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ScheduledAppointments;
