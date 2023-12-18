import React from "react";
import classes from "./History.module.css";

function History() {
  return (
    <div className={classes.mainContainer}>
      <p className={classes.heading}>HISTORY</p>

      <div className={classes.infoContainer}>
        <div className={classes.leftContainer}>
          <p>Family History: </p>
          <textarea name="" id="" cols="30" rows="6" />
        </div>
        <div className={classes.rightContainer}>
          <div>
            <p>Addiction: </p>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
