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
  TextField,
  MenuItem,
  Grid,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { db } from "../../firebase";
import { useUserAuth } from "../../context/UserAuthContext";
import DoctorNavbar from "../../components/DoctorNavbar/DoctorNavbar";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserAuth();
  const [editAppointment, setEditAppointment] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

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

        setAppointments(sortedAppointments);
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
  }, [sortColumn, sortOrder]);

  const filteredAppointments = appointments
    .filter((appointment) =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const handleCancelEdit = () => {
    setOpenEditDialog(false);
    setEditAppointment(null);
    setSelectedBloodGroup("");
    setSelectedDoctor("");
  };

  const handleLeaveEdit = () => {
    setOpenEditDialog(false);
    setEditAppointment(null);
    setSelectedBloodGroup("");
    setSelectedDoctor("");
  };

  const handleShowDeleteDialog = (appointment) => {
    setEditAppointment(appointment); // Set the appointment to be deleted
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleClearFilters = () => {
    setSortColumn(null);
    setSortOrder("asc");
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="appointments-container">
      <DoctorNavbar />
      <h1>Welcome {doctors.name}</h1>
      <div className="appointments-content">
        <h2>My Appointments</h2>
        <TextField
          label="Search Patient"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Pagination
                count={Math.ceil(filteredAppointments.length / itemsPerPage)}
                page={currentPage}
                onChange={(e, page) => paginate(page)}
                variant="outlined"
                shape="rounded"
                size="large"
              />
            </Grid>
          </Grid>
        )}

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
                <TableCell>Email</TableCell>
                <TableCell onClick={() => handleSort("appointmentDateTime")}>
                  Appointment Date {renderSortArrow("appointmentDateTime")}
                </TableCell>
                <TableCell onClick={() => handleSort("bookDateTime")}>
                  Booking Date {renderSortArrow("bookDateTime")}
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.specialistDoctor}</TableCell>
                  <TableCell>{appointment.bloodGroup}</TableCell>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{appointment.email}</TableCell>
                  <TableCell>
                    {new Date(appointment.appointmentDateTime)
                      .toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/,/g, "")}
                  </TableCell>
                  <TableCell>
                    {new Date(appointment.bookDateTime)
                      .toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                      .replace(/,/g, "")}
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
                      onClick={() => handleShowDeleteDialog(appointment)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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
                <MenuItem
                  key={doctor.id}
                  value={doctor.name + " " + doctor.surname}
                >
                  {doctor.name + " " + doctor.surname}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveEdit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to delete this appointment?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDelete(editAppointment.id);
                handleCloseDeleteDialog();
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default MyAppointments;
