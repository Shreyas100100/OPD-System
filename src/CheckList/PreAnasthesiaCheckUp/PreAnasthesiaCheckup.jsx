import SurgDet from "../PreInductionAssesment/components/SuregeryDetails";
import "./PreAnasthesiaCheckup.css";
import GenExam from "./components/GenExam";
import History from "./components/History";
import KnownCase from "./components/KnownCase";
import SurgHistory from "./components/SurgHistory";
import SurgDetails from "../IntraOperativeAnasthesia/components/SuregeryDetails";


function PAC() {
  return (
    <div className="main-container" style={{ paddingLeft: "270px", paddingTop:"20px", paddingRight:"30px"}}>
      <div>
        
      </div>
      <div className="main-heading">
        <p>PRE-ANESTHESIA CHECK-UP</p>
      </div>
      <div>
      
        <KnownCase />
        <SurgHistory />
        <History />
        <GenExam />
        <SurgDetails />
      </div>
    </div>
  );
}

export default PAC;
