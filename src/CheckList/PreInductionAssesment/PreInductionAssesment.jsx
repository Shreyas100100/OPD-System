import OtherDetails from "./components/OtherDetails";
import SurgDetails from "./components/SuregeryDetails/";

function PIA() {
  return (
    <div>
      <div>
        
      </div>
      <div className="main-container" style={{ paddingLeft: "270px", paddingTop:"20px", paddingRight:"30px"}}s>
        <div className="main-heading">
          <p>PRE-INDUCTION ASSESMENT</p>
        </div>

        <div>
          <SurgDetails />
          <OtherDetails />
        </div>
      </div>
    </div>
  );
}

export default PIA;
