import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  collection,
  getDocs,
  doc as firestoreDoc,
  updateDoc,
  deleteDoc,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "../db.css";
import DoctorNavbar from "../../../components/DoctorNavbar/DoctorNavbar";

const PatientDb = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);

        const usersData = [];
        usersSnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });

        setUserData(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateString)
    );
  };

  const handleEdit = (user) => {
    setEditUser({
      ...user,
      dob: formatDate(user.dob),
    });
    setOpenEditDialog(true);
  };

  const handleDeleteConfirmation = (user) => {
    setDeleteConfirmation(user);
  };

  const handleDelete = async (id) => {
    try {
      const userRef = firestoreDoc(db, "users", id);
      await deleteDoc(userRef);

      setUserData((prevUserData) =>
        prevUserData.filter((user) => user.id !== id)
      );

      setDeleteConfirmation(null);

      console.log(`User with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setEditUser(null);
  };

  const handleSaveEdit = async () => {
    try {
      const userRef = firestoreDoc(db, "users", editUser.id);

      await updateDoc(userRef, {
        name: editUser.name,
        surname: editUser.surname,
        dob: editUser.dob,
        role: editUser.role,
      });

      setUserData((prevUserData) =>
        prevUserData.map((user) =>
          user.id === editUser.id ? editUser : user
        )
      );

      setOpenEditDialog(false);
      setEditUser(null);

      console.log(`User with ID ${editUser.id} edited successfully.`);
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  return (
    <div className="center-container">
      <DoctorNavbar />
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} className="styled-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Surname</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData
                .filter((user) => user.role === 'Patient')
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.surname}</TableCell>
                    <TableCell>{formatDate(user.dob)}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteConfirmation(user)}
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
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            style={{ marginTop: "12px" }}
            value={editUser?.name || ""}
            onChange={(e) =>
              setEditUser({
                ...editUser,
                name: e.target.value,
              })
            }
          />
          <TextField
            label="Surname"
            fullWidth
            style={{ marginTop: "12px" }}
            value={editUser?.surname || ""}
            onChange={(e) =>
              setEditUser({
                ...editUser,
                surname: e.target.value,
              })
            }
          />
          <TextField
            label="DOB"
            type="text"
            fullWidth
            style={{ marginTop: "12px" }}
            value={editUser?.dob || ""}
            disabled
          />
          <TextField
            label="Email"
            fullWidth
            style={{ marginTop: "12px" }}
            value={editUser?.email || ""}
            disabled
          />
          <TextField
            label="Role"
            fullWidth
            style={{ marginTop: "12px" }}
            value={editUser?.role || ""}
            onChange={(e) =>
              setEditUser({
                ...editUser,
                role: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteConfirmation}
        onClose={() => setDeleteConfirmation(null)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <p>
            Are you sure you want to delete{" "}
            {`${deleteConfirmation?.name} ${
              deleteConfirmation?.surname
            } (${deleteConfirmation?.role})`}?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmation(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete(deleteConfirmation?.id);
              setDeleteConfirmation(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PatientDb;
