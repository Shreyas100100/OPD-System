import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  deleteDoc,
  doc as firestoreDoc,
  updateDoc,
} from "firebase/firestore";
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
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import "./Appointments.css";
import { db } from "../../../firebase";
import { useUserAuth } from "../../../context/UserAuthContext";
import AdminNavbar from "../../../components/AdminNavbar/AdminNavbar";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserAuth();
  const [editAppointment, setEditAppointment] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);

  const toggleFilter = (prevFilters, doctor) => {
    if (prevFilters.includes(doctor)) {
      return prevFilters.filter(
        (selectedDoctor) => selectedDoctor !== doctor
      );
    } else {
      return [...prevFilters, doctor];
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsCollection = collection(db, "appointments");
        const appointmentsQuery = query(appointmentsCollection);

        const appointmentsSnapshot = await getDocs(appointmentsQuery);

        const appointmentsData = [];
        appointmentsSnapshot.forEach((doc) => {
          appointmentsData.push({ id: doc.id, ...doc.data() });
        });

        const sortedAppointments = sortAppointments(
          appointmentsData,
          sortColumn,
          sortOrder
        );

        const filteredAppointments = sortedAppointments.filter(
          (appointment) =>
            selectedDoctors.length
              ? selectedDoctors.includes(appointment.specialistDoctor)
              : true
        );

        setAppointments(filteredAppointments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        const doctorsCollection = collection(db, "doctors"); // Update to your collection name
        const doctorsSnapshot = await getDocs(doctorsCollection);

        const doctorsData = [];
        doctorsSnapshot.forEach((doc) => {
          doctorsData.push({ id: doc.id, ...doc.data() });
        });

        setDoctors(doctorsData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchAppointments();
    fetchDoctors();
  }, [selectedDoctors, sortColumn, sortOrder]);

  const handleEdit = (appointment) => {
    setEditAppointment(appointment);
    setOpenEditDialog(true);
    setSelectedBloodGroup(appointment.bloodGroup);
    setSelectedDoctor(appointment.specialistDoctor);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setEditAppointment(null);
    setSelectedBloodGroup("");
    setSelectedDoctor("");
  };

  const handleSaveEdit = async () => {
    try {
      const appointmentRef = firestoreDoc(
        db,
        "appointments",
        editAppointment.id
      );

      await updateDoc(appointmentRef, {
        specialistDoctor: selectedDoctor || editAppointment.specialistDoctor,
        bloodGroup: selectedBloodGroup || editAppointment.bloodGroup,
        patientName: editAppointment.patientName,
        appointmentDateTime: editAppointment.appointmentDateTime,
        // Add other fields as needed
      });

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === editAppointment.id ? editAppointment : appointment
        )
      );

      setOpenEditDialog(false);
      setEditAppointment(null);

      console.log(
        `Appointment with ID ${editAppointment.id} edited successfully.`
      );
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

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortAppointments = (data, column, order) => {
    if (!column) return data;

    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];

      if (order === "asc") {
        return valueA < valueB ? -1 : 1;
      } else {
        return valueA > valueB ? -1 : 1;
      }
    });

    return sortedData;
  };

  const renderSortArrow = (column) => {
    if (sortColumn === column) {
      return sortOrder === "asc" ? "↑" : "↓";
    }
    return null;
  };

  return (
    <div className="appointments-container">
      <AdminNavbar />
      <div className="appointments-content">
        <h2>Appointments</h2>

        <div className="sort">
          {/* Add code for filters, if needed */}
        </div>

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper} className="TableContainer">
            <Table className="Table">
              <TableHead>
                <TableRow>
                  <TableCell onClick={() => handleSort("specialistDoctor")}>
                    Specialist Doctor {renderSortArrow("specialistDoctor")}
                  </TableCell>
                  <TableCell onClick={() => handleSort("bloodGroup")}>
                    Blood Group {renderSortArrow("bloodGroup")}
                  </TableCell>
                  <TableCell onClick={() => handleSort("patientName")}>
                    Patient's Name {renderSortArrow("patientName")}
                  </TableCell>
                  <TableCell onClick={() => handleSort("appointmentDateTime")}>
                    Appointment Date and Time{" "}
                    {renderSortArrow("appointmentDateTime")}
                  </TableCell>
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
                    <TableCell>
                      {new Date(appointment.appointmentDateTime).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      ).replace(/,/g,'')
                      }
                    </TableCell>
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

        <Dialog open={openEditDialog} onClose={handleEditClose}>
          <DialogTitle>Edit Appointment</DialogTitle>
          <DialogContent>
            <TextField
              label="Blood Group"
              select
              fullWidth
              style={{ marginTop: "12px" }}
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
            >
              <MenuItem value="0+">0+</MenuItem>
              <MenuItem value="A+">A+</MenuItem>
              <MenuItem value="B+">B+</MenuItem>
              <MenuItem value="AB+">AB+</MenuItem>
              <MenuItem value="O-">O-</MenuItem>
              <MenuItem value="A-">A-</MenuItem>
              <MenuItem value="B-">B-</MenuItem>
              <MenuItem value="AB-">AB-</MenuItem>
            </TextField>

            <TextField
              label="Doctor"
              select
              fullWidth
              style={{ marginTop: "12px" }}
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.name}>
                  {doctor.name}
                </MenuItem>
              ))}
            </TextField>

            {/* ... (other text fields) */}
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

export default Appointments;
