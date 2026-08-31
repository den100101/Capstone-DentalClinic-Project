import "../styles/general-dentistry.css";

function GeneralDentistry() {
  return (
    <>
      <div className="general-dentistry-container">
        <div className="general-dentistry-header">
          <h1>General Dentistry</h1>
        </div>
        <div className="general-dentistry-scope-container">
          <div>
            <img
              src="/Images/general-teeth.jpg"
              alt="general-desntistry"
              className="general-dentistry-img"
            />
          </div>
          <div className="general-dentistry-scope">
            <ul>
              <h1>General Dentistry Services</h1>
              <li>Comprehensive Oral Examination</li>
              <li>Professional Teeth Cleaning</li>
              <li>Tooth-Colored Composite Fillings</li>
              <li>Dental X-Rays</li>
              <li>Fluoride Treatment</li>
              <li>Tooth Extractions</li>
              <li>Root Canal Treatment</li>
              <li>Dental Crowns and Bridges</li>
              <li>Gum Disease Treatment</li>
              <li>Preventive Dental Care</li>
            </ul>
          </div>
        </div>
        <div className="about-general-dentistry">
          <div className="about-general-header">
            <h1></h1>General Dentistry
          </div>
          <div className="about-general-p">
            <p>
              General dentistry focuses on the prevention, diagnosis, and
              treatment of common dental problems. Regular dental visits help
              maintain healthy teeth and gums while preventing more serious oral
              health issues. Through routine examinations and professional care,
              general dentistry plays a vital role in keeping your smile healthy
              and functional for life.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default GeneralDentistry;
