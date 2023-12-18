// App.js

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/SignUp/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import DbPg from "./pages/Database/DbPg";
import BookAppointment from "./pages/BookAppointment/BookAppointment";
import ScheduledAppointments from "./pages/ScheduledAppointment/ScheduledAppointment";
import PatientProfile from "./pages/Profile/PatientProfile";
import AdminHome from "./pages/AdminHome/AdminHome";
import Appointments from "./pages/Database/Appointments/Appointments";
import AdminDatabase from "./pages/Database/AdminDatabase/AdminDatabase";
import DoctorDatabase from "./pages/Database/DoctorDatabase/DoctorDatabase";
import AdminProfile from "./pages/AdminProfile/AdminProfile";
import DoctorHome from "./pages/DoctorHome/DoctorHome";
import PatientDb from "./pages/Database/PatientDatabase/PatientDb";
import MyAppointments from "./pages/MyAppointments/MyAppointments";
import DoctorProfile from "./pages/Profile/DoctorProfile";
function App() {
  return (
    <div>
      <UserAuthContextProvider>
        <Routes>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/DbPg" element={<DbPg />} />
          <Route path="/Book-Appointment" element={<BookAppointment />} />
          <Route
            path="/Scheduled-Appointment"
            element={<ScheduledAppointments />}
          />
          <Route path="/PatientProfile" element={<PatientProfile />} />
          <Route path="/AdminHome" element={<AdminHome />} />
          <Route path="/Appointments" element={<Appointments />} />
          <Route path="/AdminDatabase" element={<AdminDatabase />} />
          <Route path="/DoctorDatabase" element={<DoctorDatabase />} />
          <Route path="/AdminProfile" element={<AdminProfile />} />
          <Route path="/DoctorHome" element={<DoctorHome />} />
          <Route path="/PatientDb" element={<PatientDb />} />
          <Route path="/MyAppointments" element={<MyAppointments />} />
          <Route path="/DoctorProfile" element={<DoctorProfile />} />

        </Routes>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
