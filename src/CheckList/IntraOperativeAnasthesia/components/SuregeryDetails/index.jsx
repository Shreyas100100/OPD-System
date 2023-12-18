import React from "react";
import classes from "./SurgeryDetails.module.css";

function SurgDetails() {
  return (
    <div>
    <div className={classes.mainContainer}>
      
    <p className={classes.heading} style={{ textAlign: "center" }}>SURGERY DETAILS</p> {/* Center-align the heading */}

      <div className={classes.infoContainer}>
        <div className={classes.innerContainer1}>
          <div>
            <div>
              <span>Surgery Name: </span>
            </div>
            <div>
              <span>Scheduled Date: </span>
            </div>
            <div>
              <span>Completed Date: </span>
            </div>
          </div>
          <div className={classes.ht}>
            <div>
              <span>Main Surgeon: </span>
              <span> DB_Surgeon</span>
            </div>
            <div>
              <span>Associate Consultant </span>
            </div>
            <div>
              <span>Anasthetist </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default SurgDetails;
