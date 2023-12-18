import React from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import { useUserAuth } from "../../context/UserAuthContext";
import { getAuth, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Disp from "../Database/Disp";
import { Link, useNavigate } from "react-router-dom";
import NvBar from "../../components/Navbar/Navbar";
import load from "../../assets/g1.gif";

import "./Home.css"; // Import your CSS file for customization

const auth = getAuth();

const Home = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <NvBar />
      <h1>WLECOME TO OPD SYSTEM ! </h1>
      <div className="gif-container">
        <img src={load} alt="Hospital GIF" className="centered-gif" />
      </div>
    </div>
  );
};

export default Home;
