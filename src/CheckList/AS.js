import { useState } from "react";
import "./css/AS.css";
import DoctorNavbar from "../components/DoctorNavbar/DoctorNavbar";


const AS = () => {
  const scoringCriteria = [
    {
      parameter: "Activity Level",
      criteria: [
        { label: "Able To Move All Four Extremities", score: 2 },
        { label: "Able To Move Two Extremities", score: 1 },
        { label: "Not Able To Control Any Extremity", score: 0 },
      ],
    },
    {
      parameter: "Respiration",
      criteria: [
        { label: "Able To Breathe Deeply And Cough", score: 2 },
        { label: "Limited Respiratory Effort (Dyspnea or Splinting)", score: 1 },
        { label: "No Spontaneous Respiratory Effect", score: 0 },
      ],
    },
    {
      parameter: "Circulation (Blood Pressure)",
      criteria: [
        {
          label: "Systolic Arterial Pressure Between +/- 20% of Pre-Anesthetic Level",
          score: 2,
        },
        {
          label: "Systolic Arterial Pressure Between +/- 20% to 50% of Pre-Anesthetic Level",
          score: 1,
        },
        {
          label: "Systolic Arterial Pressure Between +/- 51% or More of Pre-Anesthetic Level",
          score: 0,
        },
      ],
    },
    {
      parameter: "Consciousness",
      criteria: [
        { label: "Full Alertes, Patient Able To Answer Questions", score: 2 },
        { label: "Aroused When Called By Name", score: 1 },
        { label: "Failure to Elicit a Response Upon Auditory Stimulation", score: 0 },
      ],
    },
    {
      parameter: "Oxygen Saturation",
      criteria: [
        { label: "When Breathing Room Air > 90%", score: 2 },
        { label: "Requires Supplemental Oxygen to Maintain > 90%", score: 1 },
        { label: "< 90% Even With Supplemental Oxygen", score: 0 },
      ],
    },
    {
      parameter: "Skin Color",
      criteria: [
        { label: "Normal Skin Color and Appearance", score: 2 },
        { label: "Any Alteration in Skin Color (Pale, Dusky, Blotchy, Jaundiced etc.)", score: 1 },
        { label: "Frank Cyanosis", score: 0 },
      ],
    },
  ];

  const initialPatientScores = scoringCriteria.reduce((acc, criteria) => {
    acc[criteria.parameter] = {
      score: -1,
      criteriaChecked: Array(criteria.criteria.length).fill(false),
    };
    return acc;
  }, {});

  const [patientScores, setPatientScores] = useState(initialPatientScores);

  const calculateTotalScore = () => {
    let totalScore = 0;
    for (const parameter in patientScores) {
      if (patientScores[parameter].score !== -1) {
        totalScore += patientScores[parameter].score;
      }
    }
    return totalScore;
  };

  const handleScoreChange = (parameter, score) => {
    setPatientScores({
      ...patientScores,
      [parameter]: {
        ...patientScores[parameter],
        score: parseInt(score, 10),
      },
    });
  };

  const handleCriteriaRadioChange = (parameter, index, score) => {
    const criteriaChecked = Array(scoringCriteria.length).fill(false);
    criteriaChecked[index] = true;

    setPatientScores({
      ...patientScores,
      [parameter]: {
        ...patientScores[parameter],
        criteriaChecked,
        score,
      },
    });
  };

  return (
    <div className="hd"style={{ paddingLeft: "270px", paddingTop:"20px", paddingRight:"30px"}}>
      <div>
        <DoctorNavbar />
        </div>
      <h1 className="main-heading">ALDRET SCORE</h1>
      <table className="score-table" >
        <thead >
          <tr >
            <th>Sr. No.</th>
            <th>Parameter</th>
            <th>Scoring Criteria</th>
            <th>Patient's Score</th>
          </tr>
        </thead>
        <tbody>
          {scoringCriteria.map((criteria, index) => (
            <tr key={criteria.parameter}>
              <td>{index + 1}</td>
              <td>{criteria.parameter}</td>
              <td>
                {criteria.criteria.map((criterion, criterionIndex) => (
                  <div key={criterionIndex} className="criteria-row">
                    <input
                      type="radio"
                      checked={patientScores[criteria.parameter].criteriaChecked[criterionIndex]}
                      onChange={() =>
                        handleCriteriaRadioChange(criteria.parameter, criterionIndex, criterion.score)
                      }
                    />
                    <label>{criterion.label}</label>
                  </div>
                ))}
              </td>
              <td>
                <input
                  type="number"
                  readOnly 
                  value={patientScores[criteria.parameter].score !== -1 ? patientScores[criteria.parameter].score : ""}
                  onChange={(e) => handleScoreChange(criteria.parameter, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total-score-container">
        <label className="total-score-label">
          At the Shift out, Patient's total Score:{" "}
          <input
            type="number"
            readOnly 
            value={calculateTotalScore()}
            onChange={(e) => handleScoreChange("Total Score", e.target.value)}
            className="total-score-box"
          />
        </label>
      </div>
    </div>
  );
};

export default AS;