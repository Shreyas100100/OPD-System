import React from "react";
import classes from "./AnasthsiaGiven.module.css"; // Import the CSS file from the SurgeryDetails component

function AnasthsiaGiven() {
  return (
    <div className={classes.mainContainer}> 
        <p className={classes.heading}>ANASTHESIA GIVEN:</p> 
      <div className={classes.infoContainer}> 
        
        <div className={classes.checkboxContainer}> 
          <div className={classes.row}>
            <div className={classes.column}>
              <label>
                <input type="checkbox" /> General
              </label>
            </div>
            <div className={classes.column}>
              <label>
                <input type="checkbox" /> Local
              </label>
            </div>
            <div className={classes.column}>
              <label>
                <input type="checkbox" /> Regional
              </label>
            </div>
          </div>
          <div className={classes.row}>
            <div className={classes.column}>
              <label>
                <input type="checkbox" /> Conscious
              </label>
            </div>
            <div className={classes.column}>
              <label>
                <input type="checkbox" /> Monitored
              </label>
            </div>
            <div className={classes.column}>
              <label>
                <input type="checkbox" /> Intravenous
              </label>
            </div>
          </div>
          <div className={classes.row}>
            <div className={classes.column}>
              <label>
                <input type="checkbox" /> Dissociative
              </label>
            </div>
            <div className={classes.column}>
              <label>
                <input type="checkbox" /> Topical
              </label>
            </div>
            <div className={classes.column}>
              <label>
                <input type="checkbox" /> Epidural
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnasthsiaGiven;
