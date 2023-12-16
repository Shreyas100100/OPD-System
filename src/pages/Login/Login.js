// Login.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import "./login.css"; // Import the CSS file

const auth = getAuth();
const firestore = getFirestore();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Perform authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Get the user's role from Firestore
      const userSnapshot = await getDocs(
        query(collection(firestore, "users"), where("email", "==", userCredential.user.email))
      );

      if (userSnapshot.size === 1) {
        const userData = userSnapshot.docs[0].data();
        const userRole = userData.role;

        if (userRole === "Admin") {
          navigate("/adminHome");
        }
        if (userRole === "Doctor") {
          navigate("/doctorHome");
        }
        if (userRole === "Patient") {
          navigate("/home");
        }
      } else {
        setError("User data not found");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="mb-4">OPD System </h2>

        <h2 className="mb-4">Login</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit">
              Log In
            </Button>
          </div>

          <div className="text-center">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
