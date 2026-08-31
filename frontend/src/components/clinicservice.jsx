import "../styles/clinic-service.css";

function ClinicService({ setRenderComponent }) {
  return (
    <>
      <div className="service-grid-container">
        <div className="service-cards">
          <div className="service-image-contianer">
            <img
              src="/Images/general.png"
              alt="general-destistry-image"
              className="service-img"
            />
          </div>
          <div className="service-card-header">
            <h1>General Dentisry</h1>
          </div>
          <div className="service-card-p">
            <p>
              Routine check-ups, cleanings, and preventative care to keep your
              natural teeth healthy for a lifetime.
            </p>
          </div>
          <div className="service-card-button">
            <button
              className="service-card-button"
              onClick={() => setRenderComponent("General")}
            >
              View our work {">"}
            </button>
          </div>
        </div>
        <div className="service-cards">
          <div className="service-image-contianer">
            <img
              src="/Images/oral.png"
              alt="oral-surgery-img"
              className="service-img"
            />
          </div>
          <div className="service-card-header">
            <h1>Oral Surgery</h1>
          </div>
          <div className="service-card-p">
            <p>
              Expert surgical interventions including extractions and implants
              performed with the highest safety standards.
            </p>
          </div>
          <div className="service-card-button">
            <button
              className="service-card-button"
              onClick={() => setRenderComponent("Oral")}
            >
              View our work {">"}
            </button>
          </div>
        </div>
        <div className="service-cards">
          <div className="service-image-contianer">
            <img
              src="/Images/ortho.png"
              alt="orthodontics"
              className="service-img"
            />
          </div>
          <div className="service-card-header">
            <h1>Orthodentics</h1>
          </div>
          <div className="service-card-p">
            <p>
              Modern alignment solutions from traditional braces to clear
              aligners for patients of all ages.
            </p>
          </div>
          <div className="service-card-button">
            <button
              className="service-card-button"
              onClick={() => setRenderComponent("Ortho")}
            >
              View our work {">"}
            </button>
          </div>
        </div>
        <div className="service-cards">
          <div className="service-image-contianer">
            <img
              src="/Images/cosmetic.png"
              alt="cosmetic-surgery-img"
              className="service-img"
            />
          </div>
          <div className="service-card-header">
            <h1>Cosmetic Dentistry</h1>
          </div>
          <div className="service-card-p">
            <p>
              Transform your smile with professional whitening, veneers, and
              aesthetic restorations.
            </p>
          </div>
          <div className="service-card-button">
            <button
              className="service-card-button"
              onClick={() => setRenderComponent("Cosmetic")}
            >
              View our work {">"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClinicService;
