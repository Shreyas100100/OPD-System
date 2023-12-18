import React from 'react'
import classes from "./GenExam.module.css"

function GenExam() {
    return (
        <div className={classes.mainContainer}>
            <p className={classes.heading}>GENERAL EXAMINATION</p>

            <div className={classes.infoContainer}>
                <div className={classes.innerContainer1}>
                    <div>
                        <div>
                            <span>Weight: </span>
                            <input type="text" />
                            <span>kg</span>
                        </div>
                        <div>
                            <span>BP: </span>
                            <input type="text" />
                            <span>kg</span>
                        </div>
                        <div>
                            <span>Pallor: </span>
                            <input type="text" />
                            <span>kg</span>
                        </div>
                        <div>
                            <span>Edima: </span>
                            <input type="text" />
                            <span>kg</span>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>Height: </span>
                            <input type="text" />
                            <span>kg</span>
                        </div>
                        <div>
                            <span>PR: </span>
                            <input type="text" />
                            <span>kg</span>
                        </div>
                        <div>
                            <span>SPO2: </span>
                            <input type="text" />
                            <span>kg</span>
                        </div>
                        <div>
                            <span>lcterus: </span>
                            <input type="text" />
                            <span>kg</span>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>BMI: </span>
                            <input type="text" />
                            <span>kg</span>
                        </div>
                        <div>
                            <span>RR: </span>
                            <input type="text" />
                            <span>kg</span>
                        </div>
                        <div>
                            <span>JVP: </span>
                            <input type="text" />
                            <span>kg</span>
                        </div>
                        <div>
                            <span>Symptoms of Fever: </span>
                            <input type="text" />
                            <span>kg</span>
                        </div>
                    </div>
                </div>
                <div className={classes.innerContainer2}>
                    <div className={classes.leftContainer}>
                        <p>Investigation Comments: </p>
                        <textarea name="" id="" cols="30" rows="10" />
                    </div>
                    <div>
                        <p>ECG: </p>
                        <textarea name="" id="" cols="30" rows="10" />
                    </div>
                </div>
                <div className={classes.innerContainer2}>
                    <div className={classes.leftContainer}>
                        <p>2D Echo: </p>
                        <textarea name="" id="" cols="30" rows="10" />
                    </div>
                    <div>
                        <p>Additional Investigation Required: No/Yes: If Yes, Results - </p>
                        <textarea name="" id="" cols="30" rows="10" />
                    </div>
                </div>
            </div>
            <div>
                
            </div>
        </div>
        
    )
}

export default GenExam