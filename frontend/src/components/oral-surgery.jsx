import "../styles/oral-surgery.css";

function OralSurgery() {
  return (
    <>
      <div className="oral-surgery-container">
        <div className="oral-surgery-header">
          <h1>Oral Surgery</h1>
        </div>
        <div className="oral-surgery-content">
          <div>
            <img
              src="/Images/oralsurgery-teeth.jpg"
              alt="oral-surgery-img"
              className="oralsurgery-img"
            />
          </div>
          <div className="oral-surgery-services">
            <ul>
              <h1 className="oral-services-header">Oral Surgery Services</h1>
              <li>Wisdom Tooth Extraction</li>
              <li>Surgical Tooth Extraction</li>
              <li>Dental Implant Placement</li>
              <li>Bone Grafting Procedures</li>
              <li>Impacted Tooth Exposure</li>
              <li>Oral Infection Treatment</li>
              <li>Cyst and Tumor Removal</li>
              <li>Corrective Jaw Surgery</li>
              <li>Biopsy of Oral Lesions</li>
              <li>Emergency Oral Surgery</li>
            </ul>
          </div>
        </div>
        <div className="oral-surgery-description">
          <div className="oral-desc-header">
            <h1>Oral Surgery</h1>
          </div>
          <div className="oral-desc-p">
            <p>
              Oral surgery is a specialized branch of dentistry that focuses on
              diagnosing and treating conditions affecting the teeth, gums, jaw,
              and surrounding oral structures. These procedures are performed to
              address issues that cannot be resolved through routine dental
              treatments alone. Oral surgery helps restore oral health, relieve
              pain, improve function, and enhance overall quality of life.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default OralSurgery;
