import DoctorNavbar from "../../components/DoctorNavbar/DoctorNavbar";
import PAC from "../PreAnasthesiaCheckUp/PreAnasthesiaCheckup";
import PIA from "../PreInductionAssesment/PreInductionAssesment";
import AnasthsiaGiven from "./components/AnasthesiaGiven";
import SurgDetails from "./components/SuregeryDetails";

function IOA() {
  return (
    <div>
      <div>
        <DoctorNavbar />
      </div>
      <div>
        <PIA />
      </div>
      <div
        className="main-container"
        style={{
          paddingLeft: "270px",
          paddingTop: "20px",
          paddingRight: "30px",
        }}
      >
        <div className="main-heading">
          <p>INTRA OPERATIVE ANASTHESIA</p>
        </div>

        <div>
          <SurgDetails />
          <AnasthsiaGiven />
        </div>
      </div>
      <div>
        <PAC />
      </div>
    </div>
  );
}

export default IOA;
