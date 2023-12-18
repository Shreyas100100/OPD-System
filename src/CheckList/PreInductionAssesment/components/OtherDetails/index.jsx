import React from "react";
import classes from "./OtherDetails.module.css";

function OtherDetails() {
  return (
    <div className={classes.mainContainer}>
      <p className={classes.heading}>GENERAL EXAMINATION</p>

      <div className={classes.infoContainer}>
        <div className={classes.innerContainer1}>
          <div>
            <div>
              <span>BP: </span>
              <input type="number" />
              <span> / </span>
              <input type="number" />
            </div>
            <div>
              <span>RR: </span>
              <input type="number" />
              <span> /min</span>
            </div>
          </div>
          <div>
            <div>
              <span>Pulse: </span>
              <input type="number" />
              <span> /min</span>
            </div>
            <div>
              <span>ECG: </span>
              <input type="text" />
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default OtherDetails;
