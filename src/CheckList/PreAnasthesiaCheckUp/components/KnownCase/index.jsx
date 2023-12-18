import React from "react";
import classes from "./KnownCase.module.css";

function KnownCase() {
  return (
    <div className={classes.mainContainer}>
      <p className={classes.heading}>KNOWN CASE OF</p>

      <div className={classes.infoContainer}>
        <div className={classes.leftContainer}>
          <div className={classes.kcoDiv}>
            <p>KCO: </p>
            <div></div>
          </div>
          <div>
            <p>KCO (Other)</p>
            <textarea name="" id="" cols="30" rows="3" />
          </div>
        </div>

        <div className={classes.rightContainer} >
            <p>Substances</p>
            <textarea name="" id="" cols="30" rows="5"></textarea>
        </div>
      </div>
    </div>
  );
}

export default KnownCase;
