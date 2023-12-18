import React from 'react'
import classes from "./SurgeryDet.module.css"

function SurgeryDet() {
    return (
        <div className={classes.mainContainer}>
            <p className={classes.heading}>SURGERY DEATAILS</p>

            <div className={classes.infoContainer}>
                <div className={classes.leftContainer}>
                    <div>
                        <p>Noted Physician's Assessment, Done By Dr: </p>

                        <select name="doctors" id="doctors">
                            <option value="Dr. Mohan Swami">Dr. Mohan Swami</option>
                            <option value="saab">Saab</option>
                            <option value="mercedes">Mercedes</option>
                            <option value="audi">Audi</option>
                        </select>
                    </div>

                    <div className={classes.innerTwo}>
                        <p>Surgery Name: -----------</p>
                        <p>Scheduled Date: -----------</p>
                        <p>Completed Date: -----------</p>
                        <p>Main Surgeon: -----------</p>
                        <p>Associate: -----------</p>
                        <p>Consultant: -----------</p>
                        <p>Anaesthetist: -----------</p>
                    </div>

                </div>
                <div className={classes.rightContainer}>
                    <div>
                        <p>Date: </p>
                        <input type="date" />
                    </div>
                    <div>
                        <p>Duration: </p>
                        <input type="text" /><span>Min</span>
                    </div>
                    <div>
                        <p>Pre-Operative Diagnosis:</p>
                        <textarea name="" id="" cols="30" rows="5" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SurgeryDet